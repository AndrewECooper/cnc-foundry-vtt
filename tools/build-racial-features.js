#!/usr/bin/env node
import { readFile, readdir, writeFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..');
const sourceMd = path.join(repoRoot, 'tools', 'source', 'cnc-races.md');
const outDir = path.join(repoRoot, 'packs-src', 'racial-features');

const METADATA_LABELS = new Set([
  'LANGUAGES',
  'LANGUAGE',
  'SIZE',
  'MOVEMENT',
  'TYPICAL CLASSES',
  'CLASSES',
  'ATTRIBUTE MODIFIERS',
  'CLASS MODIFIERS',
  'ROGUE AND ASSASSIN MODIFIER',
  'RANGER MODIFIER',
]);

const ATTRIBUTES = new Set([
  'strength',
  'dexterity',
  'constitution',
  'intelligence',
  'wisdom',
  'charisma',
]);

// Label is **LABEL:**, where LABEL is uppercase letters/digits/spaces/punct,
// optionally followed by a single (...) parenthetical that may contain mixed case.
// This prevents matching bold prose lines like "**All half-elves possess...:**"
// because the regex requires the body before any parens to be uppercase.
const FEATURE_LABEL_RE =
  /^\*\*([A-Z0-9][A-Z0-9 \-/&'.]*?(?:\s*\([A-Za-z0-9 ,/-]+\))?):\*\*\s*(.*)$/;

const LINEAGE_RE = /^\*\*[^*]*\bhuman lineage\b[^*]*:\*\*/i;
const ELVEN_LINEAGE_RE = /^\*\*[^*]*\belven lineage\b[^*]*:\*\*/i;
const ALL_LINEAGES_RE = /^\*\*All half-elves[^*]*:\*\*/i;

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function toTitleCase(s) {
  return s
    .toLowerCase()
    .split(/(\s+|[-/(])/)
    .map(part => {
      if (/^\s+$/.test(part) || part === '-' || part === '/' || part === '(') return part;
      if (part.length === 0) return part;
      return part[0].toUpperCase() + part.slice(1);
    })
    .join('');
}

function deterministicId(raceSlug, featureSlug) {
  const hash = crypto
    .createHash('sha1')
    .update(`racial-features:${raceSlug}:${featureSlug}`)
    .digest('hex');
  return hash.slice(0, 16);
}

function deterministicFolderId(raceSlug) {
  const hash = crypto
    .createHash('sha1')
    .update(`folder:racial-features:${raceSlug}`)
    .digest('hex');
  return hash.slice(0, 16);
}

function buildFolder(race, folderId) {
  return {
    _id: folderId,
    _key: `!folders!${folderId}`,
    name: toTitleCase(race.name),
    type: 'Item',
    description: '',
    folder: null,
    sorting: 'a',
    color: null,
    sort: 0,
    flags: {},
  };
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function applyInline(text) {
  let out = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
  out = out.replace(/(^|[^_])_([^_\n]+)_(?!_)/g, '$1<em>$2</em>');
  return out;
}

function inline(text) {
  return applyInline(escapeHtml(text));
}

function renderTable(rows) {
  const splitRow = line => {
    let s = line.trim();
    if (s.startsWith('|')) s = s.slice(1);
    if (s.endsWith('|')) s = s.slice(0, -1);
    return s.split('|').map(c => c.trim());
  };
  const cells = rows.map(splitRow);
  const isAlignmentRow = r => r.every(c => /^:?-+:?$/.test(c));
  let header = null;
  let bodyStart = 0;
  if (cells.length >= 2 && isAlignmentRow(cells[1])) {
    header = cells[0];
    bodyStart = 2;
  }
  let html = '<table>';
  if (header) {
    html += '<thead><tr>';
    for (const c of header) html += `<th>${inline(c)}</th>`;
    html += '</tr></thead>';
  }
  html += '<tbody>';
  for (let i = bodyStart; i < cells.length; i++) {
    html += '<tr>';
    for (const c of cells[i]) html += `<td>${inline(c)}</td>`;
    html += '</tr>';
  }
  html += '</tbody></table>';
  return html;
}

function bodyToHtml(lines) {
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '') {
      i++;
      continue;
    }
    if (line.startsWith('|')) {
      const start = i;
      while (i < lines.length && lines[i].trim().startsWith('|')) i++;
      blocks.push({ type: 'table', lines: lines.slice(start, i) });
      continue;
    }
    const start = i;
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('|')
    ) {
      i++;
    }
    blocks.push({ type: 'p', lines: lines.slice(start, i) });
  }
  return blocks
    .map(b => {
      if (b.type === 'p') return `<p>${inline(b.lines.join(' '))}</p>`;
      if (b.type === 'table') return renderTable(b.lines);
      return '';
    })
    .join('');
}

function parseFeatureLabel(line) {
  const m = line.match(FEATURE_LABEL_RE);
  if (!m) return null;
  let label = m[1].trim();
  const rest = m[2];
  let attribute = null;
  // Strip a trailing parenthetical only if it names a single attribute.
  const parenMatch = label.match(/^(.*?)\s*\(([^()]+)\)\s*$/);
  if (parenMatch) {
    const inside = parenMatch[2].trim();
    if (ATTRIBUTES.has(inside.toLowerCase())) {
      label = parenMatch[1].trim();
      attribute = inside;
    }
  }
  return { label, attribute, rest };
}

function isMetadataLine(line) {
  const m = line.match(FEATURE_LABEL_RE);
  if (!m) return false;
  // For metadata detection, ignore any trailing parenthetical and uppercase the rest.
  const baseLabel = m[1].replace(/\s*\([^()]*\)\s*$/, '').trim().toUpperCase();
  return METADATA_LABELS.has(baseLabel);
}

function parseRaces(md) {
  const lines = md.split(/\r?\n/);
  const races = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    if (!h2 || line.startsWith('###')) {
      i++;
      continue;
    }
    const raceName = h2[1].trim();
    const startRace = i;
    i++;
    let nextH2 = i;
    while (nextH2 < lines.length && !/^##\s+(?!#)/.test(lines[nextH2])) nextH2++;

    let abilitiesStart = -1;
    for (let j = startRace + 1; j < nextH2; j++) {
      if (/^###\s+Racial Traits and Abilities\s*$/.test(lines[j])) {
        abilitiesStart = j + 1;
        break;
      }
    }
    if (abilitiesStart === -1) {
      i = nextH2;
      continue;
    }

    let abilitiesEnd = nextH2;
    for (let j = abilitiesStart; j < nextH2; j++) {
      const ln = lines[j];
      if (/^###\s+(?!#)/.test(ln)) {
        abilitiesEnd = j;
        break;
      }
      if (isMetadataLine(ln)) {
        abilitiesEnd = j;
        break;
      }
    }

    const features = [];
    const ambiguous = [];
    let lineage = null; // null | 'Human Lineage' | 'Elven Lineage'
    let current = null;
    for (let j = abilitiesStart; j < abilitiesEnd; j++) {
      const ln = lines[j];

      if (ALL_LINEAGES_RE.test(ln)) {
        if (current) {
          features.push(current);
          current = null;
        }
        lineage = null;
        continue;
      }
      if (LINEAGE_RE.test(ln)) {
        if (current) {
          features.push(current);
          current = null;
        }
        lineage = 'Human Lineage';
        continue;
      }
      if (ELVEN_LINEAGE_RE.test(ln)) {
        if (current) {
          features.push(current);
          current = null;
        }
        lineage = 'Elven Lineage';
        continue;
      }

      const labelInfo = parseFeatureLabel(ln);
      if (labelInfo) {
        if (current) features.push(current);
        current = {
          label: labelInfo.label,
          attribute: labelInfo.attribute,
          lineage,
          bodyLines: [],
        };
        if (labelInfo.rest && labelInfo.rest.length > 0) {
          current.bodyLines.push(labelInfo.rest);
        }
        continue;
      }

      if (current) {
        current.bodyLines.push(ln);
      } else if (ln.trim() !== '') {
        ambiguous.push({
          line: j + 1,
          reason: 'Prose without feature label in Racial Traits section',
          text: ln.trim().slice(0, 120),
        });
      }
    }
    if (current) features.push(current);

    races.push({
      name: raceName,
      slug: slugify(raceName),
      features,
      ambiguous,
    });
    i = nextH2;
  }
  return races;
}

function buildDocument(race, feature, folderId) {
  const baseLabel = toTitleCase(feature.label);
  const featureName = feature.lineage
    ? `${baseLabel} (${feature.lineage})`
    : baseLabel;
  const featureSlug = feature.lineage
    ? slugify(`${feature.label}-${feature.lineage}`)
    : slugify(feature.label);
  const id = deterministicId(race.slug, featureSlug);
  const fileSlug = `${race.slug}-${featureSlug}`;

  const headerParts = [`<p><em>Race: ${escapeHtml(toTitleCase(race.name))}</em></p>`];
  if (feature.lineage) {
    headerParts.push(`<p><em>Lineage: ${escapeHtml(feature.lineage)}</em></p>`);
  }
  if (feature.attribute) {
    headerParts.push(
      `<p><em>Attribute Check: ${escapeHtml(toTitleCase(feature.attribute))}</em></p>`,
    );
  }
  const bodyHtml = bodyToHtml(feature.bodyLines);
  const description = headerParts.join('') + bodyHtml;

  return {
    fileSlug,
    doc: {
      _id: id,
      _key: `!items!${id}`,
      name: featureName,
      type: 'feature',
      img: 'icons/svg/item-bag.svg',
      system: {
        description,
        formula: { value: '', label: 'TLGCC.Formula' },
        value: '',
        feature: { value: '' },
      },
      effects: [],
      folder: folderId,
      flags: {},
      ownership: { default: 0 },
    },
  };
}

async function clearOutputDir(dir) {
  if (!existsSync(dir)) return;
  const entries = await readdir(dir);
  for (const entry of entries) {
    if (entry.endsWith('.json')) {
      await rm(path.join(dir, entry));
    }
  }
}

async function main() {
  const md = await readFile(sourceMd, 'utf8');
  const races = parseRaces(md);
  await mkdir(outDir, { recursive: true });
  await clearOutputDir(outDir);

  const counts = {};
  const ambiguousAll = [];
  let total = 0;
  let folderCount = 0;
  const writtenIds = new Set();
  for (const race of races) {
    counts[race.name] = 0;
    const folderId = deterministicFolderId(race.slug);
    const folderDoc = buildFolder(race, folderId);
    await writeFile(
      path.join(outDir, `__folder-${race.slug}.json`),
      JSON.stringify(folderDoc, null, 2) + '\n',
    );
    folderCount++;
    for (const feature of race.features) {
      const { fileSlug, doc } = buildDocument(race, feature, folderId);
      if (writtenIds.has(doc._id)) {
        ambiguousAll.push({
          race: race.name,
          feature: feature.label,
          reason: `Duplicate _id ${doc._id} — slug collision`,
        });
        continue;
      }
      writtenIds.add(doc._id);
      const filename = `${fileSlug}.json`;
      await writeFile(
        path.join(outDir, filename),
        JSON.stringify(doc, null, 2) + '\n',
      );
      counts[race.name]++;
      total++;
    }
    for (const a of race.ambiguous) {
      ambiguousAll.push({ race: race.name, ...a });
    }
  }

  console.log(`\nGenerated ${total} racial feature documents and ${folderCount} folders.\n`);
  console.log('Per-race breakdown:');
  for (const race of races) {
    console.log(`  ${race.name}: ${counts[race.name]}`);
  }
  if (ambiguousAll.length) {
    console.log(`\nAmbiguous items (${ambiguousAll.length}):`);
    for (const a of ambiguousAll) {
      const where = a.line ? ` line ${a.line}` : '';
      const what = a.text ? ` :: ${a.text}` : '';
      console.log(`  [${a.race}${where}] ${a.reason}${what}`);
    }
  } else {
    console.log('\nNo ambiguous items flagged.');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
