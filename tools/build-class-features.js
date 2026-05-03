#!/usr/bin/env node
import { readFile, readdir, writeFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..');
const sourceMd = path.join(repoRoot, 'tools', 'source', 'cnc-classes.md');
const outDir = path.join(repoRoot, 'packs-src', 'class-features');

const SKIPPED_CLASS_HEADINGS = new Set([
  'Classes and the Castle Keeper',
  'Class Description Terminology',
]);

const METADATA_LABELS = new Set([
  'PRIME ATTRIBUTE',
  'ALIGNMENT',
  'HIT DICE',
  'HIT DIE',
  'HIT DICE (HD)',
  'WEAPONS',
  'WEAPONS ALLOWED',
  'ARMOR',
  'ARMOR ALLOWED',
  'ABILITIES',
  'LEVEL',
  'BONUS TO HIT (BTH)',
  'EXPERIENCE POINT PROGRESSION (EPP)',
]);

const FEATURE_LABEL_RE = /^\*\*([A-Z0-9][A-Z0-9 \-/(),.&']*?):\*\*\s*(.*)$/;

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
    .split(/(\s+|[-/])/)
    .map(part => {
      if (/^\s+$/.test(part) || part === '-' || part === '/') return part;
      if (part.length === 0) return part;
      return part[0].toUpperCase() + part.slice(1);
    })
    .join('');
}

function deterministicId(classSlug, featureSlug) {
  const hash = crypto
    .createHash('sha1')
    .update(`${classSlug}:${featureSlug}`)
    .digest('hex');
  return hash.slice(0, 16);
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Apply inline markdown formatting to already-html-escaped text.
function applyInline(text) {
  // Bold: **...** -> <strong>...</strong>
  let out = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Italic: *...* (single-asterisk runs that are not part of bold)
  out = out.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
  // Italic: _..._
  out = out.replace(/(^|[^_])_([^_\n]+)_(?!_)/g, '$1<em>$2</em>');
  return out;
}

function inline(text) {
  return applyInline(escapeHtml(text));
}

function renderTable(rows) {
  // rows: array of strings starting with '|'
  // Strip leading/trailing '|', split by '|', trim each cell.
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

function renderBlockquote(lines) {
  // lines: array of strings each starting with '>'
  // Strip leading '>' and optional space.
  const stripped = lines.map(l => l.replace(/^>\s?/, ''));
  // Group into paragraphs separated by blank lines.
  const paragraphs = [];
  let current = [];
  for (const l of stripped) {
    if (l.trim() === '') {
      if (current.length) {
        paragraphs.push(current.join(' '));
        current = [];
      }
    } else {
      current.push(l);
    }
  }
  if (current.length) paragraphs.push(current.join(' '));
  let html = '<blockquote>';
  for (const p of paragraphs) html += `<p>${inline(p)}</p>`;
  html += '</blockquote>';
  return html;
}

// Convert a list of body lines (already stripped of feature label) to HTML.
function bodyToHtml(lines) {
  // Group lines into blocks: paragraphs, blockquotes, tables.
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
    if (line.startsWith('>')) {
      const start = i;
      while (
        i < lines.length &&
        (lines[i].startsWith('>') || (i > start && lines[i].trim() === '' && i + 1 < lines.length && lines[i + 1].startsWith('>')))
      ) {
        i++;
      }
      blocks.push({ type: 'blockquote', lines: lines.slice(start, i) });
      continue;
    }
    // Paragraph: collect until blank line, table, or blockquote.
    const start = i;
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('|') &&
      !lines[i].startsWith('>')
    ) {
      i++;
    }
    blocks.push({ type: 'p', lines: lines.slice(start, i) });
  }
  return blocks
    .map(b => {
      if (b.type === 'p') return `<p>${inline(b.lines.join(' '))}</p>`;
      if (b.type === 'table') return renderTable(b.lines);
      if (b.type === 'blockquote') return renderBlockquote(b.lines);
      return '';
    })
    .join('');
}

function parseFeatureLabel(line) {
  const m = line.match(FEATURE_LABEL_RE);
  if (!m) return null;
  let label = m[1].trim();
  const rest = m[2];
  // Detect trailing parenthetical attribute hint like "TURN UNDEAD (WISDOM)"
  let attribute = null;
  const attrMatch = label.match(/^(.*?)\s*\(([A-Z][A-Z\s/]+)\)\s*$/);
  if (attrMatch) {
    label = attrMatch[1].trim();
    attribute = attrMatch[2].trim();
  }
  return { label, attribute, rest };
}

function isMetadataLine(line) {
  const m = line.match(FEATURE_LABEL_RE);
  if (!m) return false;
  return METADATA_LABELS.has(m[1].trim().toUpperCase());
}

function parseClasses(md) {
  const lines = md.split(/\r?\n/);
  const classes = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    if (!h2 || line.startsWith('###')) {
      i++;
      continue;
    }
    const heading = h2[1].trim();
    if (SKIPPED_CLASS_HEADINGS.has(heading)) {
      // Skip until next H2.
      i++;
      while (i < lines.length && !/^##\s+(?!#)/.test(lines[i])) i++;
      continue;
    }
    // Class heading e.g. "Assassin (dexterity)"
    const classMatch = heading.match(/^([^(]+?)(?:\s*\(([^)]+)\))?\s*$/);
    const className = classMatch[1].trim();
    const classAttr = classMatch[2]?.trim() ?? null;
    // Find ### Abilities sub-section
    const startClass = i;
    i++;
    // Walk until next H2 to bound the class.
    let nextH2 = i;
    while (nextH2 < lines.length && !/^##\s+(?!#)/.test(lines[nextH2])) nextH2++;
    // Within [startClass+1, nextH2), find ### Abilities.
    let abilitiesStart = -1;
    for (let j = startClass + 1; j < nextH2; j++) {
      if (/^###\s+Abilities\s*$/.test(lines[j])) {
        abilitiesStart = j + 1;
        break;
      }
    }
    if (abilitiesStart === -1) {
      i = nextH2;
      continue;
    }
    // Find end of abilities section: next ### or class metadata terminator.
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
    // Now parse features inside [abilitiesStart, abilitiesEnd).
    const features = [];
    const ambiguous = [];
    let j = abilitiesStart;
    let current = null;
    let pendingH4 = false;
    while (j < abilitiesEnd) {
      const ln = lines[j];
      if (/^####\s+(?!#)/.test(ln)) {
        // H4 sub-heading inside abilities. Close current feature if open and skip.
        if (current) {
          features.push(current);
          current = null;
        }
        ambiguous.push({
          line: j + 1,
          reason: 'H4 sub-heading inside Abilities section (content dropped)',
          text: ln.trim(),
        });
        pendingH4 = true;
        j++;
        // Skip H4 body until we hit a blank line followed by a feature label or another structural break.
        while (j < abilitiesEnd) {
          const sub = lines[j];
          if (FEATURE_LABEL_RE.test(sub)) break;
          j++;
        }
        continue;
      }
      const labelInfo = parseFeatureLabel(ln);
      if (labelInfo) {
        if (current) features.push(current);
        const labelUpper = labelInfo.label.toUpperCase();
        if (METADATA_LABELS.has(labelUpper)) {
          // Shouldn't happen — handled above. End loop.
          break;
        }
        if (labelUpper === 'SPECIAL') {
          ambiguous.push({
            line: j + 1,
            reason: 'SPECIAL label encountered in Abilities section — treated as non-feature, content dropped',
            text: ln.trim().slice(0, 120),
          });
          current = null;
          // Consume body until next feature label.
          j++;
          while (j < abilitiesEnd) {
            const sub = lines[j];
            if (FEATURE_LABEL_RE.test(sub) || /^###?\s+(?!#)/.test(sub)) break;
            j++;
          }
          continue;
        }
        current = {
          label: labelInfo.label,
          attribute: labelInfo.attribute,
          bodyLines: [],
        };
        if (labelInfo.rest && labelInfo.rest.length > 0) {
          current.bodyLines.push(labelInfo.rest);
        }
        pendingH4 = false;
        j++;
        continue;
      }
      // Otherwise, accumulate body lines if a feature is open.
      if (current && !pendingH4) {
        current.bodyLines.push(ln);
      } else if (!pendingH4 && ln.trim() !== '') {
        // Non-feature prose without an open feature — flag it.
        ambiguous.push({
          line: j + 1,
          reason: 'Prose without feature label in Abilities section',
          text: ln.trim().slice(0, 120),
        });
      }
      j++;
    }
    if (current) features.push(current);
    classes.push({
      name: className,
      attribute: classAttr,
      slug: slugify(className),
      features,
      ambiguous,
    });
    i = nextH2;
  }
  return classes;
}

function buildDocument(cls, feature) {
  const featureName = toTitleCase(feature.label);
  const featureSlug = slugify(feature.label);
  const id = deterministicId(cls.slug, featureSlug);
  const fileSlug = `${cls.slug}-${featureSlug}`;

  const headerParts = [`<p><em>Class: ${escapeHtml(toTitleCase(cls.name))}</em></p>`];
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
      folder: null,
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
  const classes = parseClasses(md);
  await mkdir(outDir, { recursive: true });
  await clearOutputDir(outDir);

  const counts = {};
  const ambiguousAll = [];
  let total = 0;
  const writtenIds = new Set();
  for (const cls of classes) {
    counts[cls.name] = 0;
    for (const feature of cls.features) {
      const { fileSlug, doc } = buildDocument(cls, feature);
      if (writtenIds.has(doc._id)) {
        ambiguousAll.push({
          class: cls.name,
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
      counts[cls.name]++;
      total++;
    }
    for (const a of cls.ambiguous) {
      ambiguousAll.push({ class: cls.name, ...a });
    }
  }

  console.log(`\nGenerated ${total} class feature documents.\n`);
  console.log('Per-class breakdown:');
  for (const cls of classes) {
    console.log(`  ${cls.name}: ${counts[cls.name]}`);
  }
  if (ambiguousAll.length) {
    console.log(`\nAmbiguous items (${ambiguousAll.length}):`);
    for (const a of ambiguousAll) {
      const where = a.line ? ` line ${a.line}` : '';
      const what = a.text ? ` :: ${a.text}` : '';
      console.log(`  [${a.class}${where}] ${a.reason}${what}`);
    }
  } else {
    console.log('\nNo ambiguous items flagged.');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
