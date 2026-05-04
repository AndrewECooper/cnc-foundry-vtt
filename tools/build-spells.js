#!/usr/bin/env node
import { readFile, readdir, writeFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..');
const sourceDir = path.join(repoRoot, 'tools', 'source');
const outDir = path.join(repoRoot, 'packs-src', 'spells');

const PACK_NAME = 'spells';
const CLASSES = ['Cleric', 'Druid', 'Wizard', 'Illusionist'];
const LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// ---- Utilities ----------------------------------------------------------

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function deterministicId(input) {
  return crypto.createHash('sha1').update(input).digest('hex').slice(0, 16);
}

function toTitleCaseWord(w) {
  if (w.length === 0) return w;
  return w
    .split(/([-/–])/)
    .map(part => {
      if (/^[-/–]$/.test(part)) return part;
      if (part.length === 0) return part;
      return part[0].toUpperCase() + part.slice(1).toLowerCase();
    })
    .join('');
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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

// ---- Markdown table / body rendering -----------------------------------

function splitTableRow(line) {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|')) s = s.slice(0, -1);
  return s.split('|').map(c => c.trim());
}

function isAlignmentRow(cells) {
  return cells.length > 0 && cells.every(c => /^:?-+:?$/.test(c));
}

function renderTable(rows) {
  const cells = rows.map(splitTableRow);
  let header = null;
  let bodyStart = 0;
  if (cells.length >= 2 && isAlignmentRow(cells[1])) {
    header = cells[0];
    bodyStart = 2;
  }
  let html = '<table>';
  if (header && header.some(c => c.length > 0)) {
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

// ---- Heading parsing ---------------------------------------------------

// "ACID ARROW, Level 2 wizard"
// "ANIMATE DEAD*, Level 3 cleric, 5 wizard"
// "ASTRAL PROJECTION, Level 9 all"
// "ANTIPATHY*, Level 8 wizard, 9 cleric, 9 druid"
// "ARCANE MARK, Level 0 wizard, 0 illusionist"
// "ANTI–ILLUSION SHIELD, Level 6 Illusionist"
function parseSpellHeading(heading) {
  const m = heading.match(/^(.+?),\s*Level\s+(.+)$/i);
  if (!m) return { parseError: 'no "Level" segment' };
  let name = m[1].trim();
  const isReverse = name.endsWith('*');
  if (isReverse) name = name.slice(0, -1).trim();
  name = name
    .split(/\s+/)
    .map(toTitleCaseWord)
    .join(' ');

  const spec = m[2].trim();
  const chunks = spec.split(',').map(c => c.trim().replace(/^level\s+/i, ''));
  const pairings = [];
  let lastLevel = null;
  for (const chunk of chunks) {
    const cm = chunk.match(/^(\d+)\s+(.+)$/);
    let level;
    let cls;
    if (cm) {
      level = parseInt(cm[1], 10);
      cls = cm[2].trim().toLowerCase();
      lastLevel = level;
    } else {
      if (lastLevel === null) {
        return { name, isReverse, parseError: `class without level: "${chunk}"` };
      }
      level = lastLevel;
      cls = chunk.toLowerCase();
    }
    if (cls === 'all') {
      for (const c of CLASSES) pairings.push({ class: c, level });
    } else {
      const matched = CLASSES.find(c => c.toLowerCase() === cls);
      if (!matched) {
        return { name, isReverse, parseError: `unknown class "${cls}"` };
      }
      pairings.push({ class: matched, level });
    }
  }
  return { name, isReverse, pairings };
}

// ---- Stat block --------------------------------------------------------

function parseStatBlock(dataRows) {
  // dataRows: 2 rows of 3 cells.
  // Row 1: "CT ...", "R ...", "D ..."
  // Row 2: "SV ...", "SR ...", "Comp ..."
  const stat = { ct: '', range: '', duration: '', sv: '', sr: '', comp: '' };
  if (dataRows.length < 2) return stat;
  const stripPrefix = (cell, prefix) => {
    const re = new RegExp(`^${prefix}\\s+`, 'i');
    return cell.replace(re, '').trim();
  };
  const [r1, r2] = dataRows;
  if (r1[0]) stat.ct = stripPrefix(r1[0], 'CT');
  if (r1[1]) stat.range = stripPrefix(r1[1], 'R');
  if (r1[2]) stat.duration = stripPrefix(r1[2], 'D');
  if (r2[0]) stat.sv = stripPrefix(r2[0], 'SV');
  if (r2[1]) stat.sr = stripPrefix(r2[1], 'SR');
  if (r2[2]) stat.comp = stripPrefix(r2[2], 'Comp');
  return stat;
}

function tableDataRows(lines) {
  const cells = lines.map(splitTableRow);
  const dataStart = cells.length >= 2 && isAlignmentRow(cells[1]) ? 2 : 0;
  return cells.slice(dataStart);
}

// ---- Source parsing ----------------------------------------------------

function parseSpells(md) {
  const lines = md.split(/\r?\n/);
  const spells = [];
  let current = null;
  let descLines = null;
  let collecting = null;
  let statBlockSeen = false;

  const flushTable = () => {
    if (!collecting) return;
    const tableLines = collecting;
    collecting = null;
    if (!statBlockSeen) {
      current.statBlock = parseStatBlock(tableDataRows(tableLines));
      statBlockSeen = true;
    } else {
      for (const tl of tableLines) descLines.push(tl);
    }
  };

  const flushSpell = () => {
    if (!current) return;
    flushTable();
    current.descLines = descLines;
    spells.push(current);
    current = null;
    descLines = null;
    collecting = null;
    statBlockSeen = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i];
    const h3 = ln.match(/^###\s+(.+?)\s*$/);
    // H4 only counts as a new spell if it has a comma (i.e., looks like a
    // spell heading); otherwise it's a sub-section inside the current spell's
    // description, so leave it as inline content.
    const h4 = ln.match(/^####\s+(.+?)\s*$/);
    const h = h3 || (h4 && h4[1].includes(',') ? h4 : null);
    if (h) {
      flushSpell();
      current = { heading: h[1].trim(), statBlock: null };
      descLines = [];
      collecting = null;
      statBlockSeen = false;
      continue;
    }
    if (!current) continue;
    if (ln.startsWith('|')) {
      if (collecting === null) collecting = [];
      collecting.push(ln);
      continue;
    }
    if (collecting !== null) flushTable();
    descLines.push(ln);
  }
  flushSpell();
  return spells;
}

// ---- Folder construction -----------------------------------------------

function topFolderId(className) {
  return deterministicId(`folder:${PACK_NAME}:${className}`);
}

function levelFolderId(className, level) {
  return deterministicId(`folder:${PACK_NAME}:${className}:Level ${level}`);
}

function buildTopFolder(className, sortIdx) {
  const id = topFolderId(className);
  return {
    _id: id,
    _key: `!folders!${id}`,
    name: className,
    type: 'Item',
    description: '',
    folder: null,
    sorting: 'm',
    color: null,
    sort: sortIdx * 100,
    flags: {},
  };
}

function buildLevelFolder(className, level) {
  const id = levelFolderId(className, level);
  return {
    _id: id,
    _key: `!folders!${id}`,
    name: `Level ${level}`,
    type: 'Item',
    description: '',
    folder: topFolderId(className),
    sorting: 'a',
    color: null,
    sort: level * 100,
    flags: {},
  };
}

// ---- Spell doc ---------------------------------------------------------

function buildSpellDoc(spell, parsed, pairing) {
  const slug = slugify(spell.name);
  const cls = pairing.class;
  const lvl = pairing.level;
  const id = deterministicId(`${PACK_NAME}:${cls.toLowerCase()}:${lvl}:${slug}`);
  const fileSlug = `${cls.toLowerCase()}-${lvl}-${slug}`;
  const sb = spell.statBlock || {};

  return {
    fileSlug,
    doc: {
      _id: id,
      _key: `!items!${id}`,
      name: spell.name,
      type: 'spell',
      img: 'icons/svg/item-bag.svg',
      system: {
        description: bodyToHtml(spell.descLines || []),
        class: { value: cls, label: 'TLGCC.Class' },
        duration: { value: sb.duration || '', label: 'TLGCC.Duration' },
        savevalue: { value: sb.sv || '', label: 'TLGCC.SaveValue' },
        spellresist: { value: sb.sr || '', label: 'TLGCC.SpellResistance' },
        spellcomp: { value: sb.comp || '', label: 'TLGCC.SpellComp' },
        prepared: { value: 0, label: 'TLGCC.Prepared' },
        range: { value: sb.range || '', label: 'TLGCC.Range' },
        spelldmg: { value: '', label: 'TLGCC.SpellDamage' },
        cast: { value: sb.ct || '', label: 'TLGCC.SpellCastTime' },
        component: { value: '', label: 'TLGCC.SpellComponent' },
        summary: { value: '', label: 'TLGCC.SpellSummary' },
        spellLevel: { value: lvl, label: 'TLGCC.SpellLevel' },
        spell: { spelllevel: lvl, summary: '' },
      },
      effects: [],
      folder: levelFolderId(cls, lvl),
      flags: {},
      ownership: { default: 0 },
    },
  };
}

// ---- Main --------------------------------------------------------------

async function clearOutputDir(dir) {
  if (!existsSync(dir)) return;
  for (const e of await readdir(dir)) {
    if (e.endsWith('.json')) await rm(path.join(dir, e));
  }
}

async function main() {
  const files = (await readdir(sourceDir))
    .filter(f => /^cnc-spells-.*\.md$/.test(f))
    .sort();
  if (files.length === 0) {
    console.error(`No cnc-spells-*.md files found in ${sourceDir}`);
    process.exit(1);
  }
  console.log(`Reading ${files.length} source file(s):`);
  for (const f of files) console.log(`  ${f}`);

  const spells = [];
  for (const f of files) {
    const md = await readFile(path.join(sourceDir, f), 'utf8');
    const fileSpells = parseSpells(md);
    for (const s of fileSpells) s.sourceFile = f;
    spells.push(...fileSpells);
  }
  await mkdir(outDir, { recursive: true });
  await clearOutputDir(outDir);

  // Folders: 4 top-level + 40 nested (4 classes x 10 levels)
  for (let i = 0; i < CLASSES.length; i++) {
    const cls = CLASSES[i];
    const f = buildTopFolder(cls, i);
    await writeFile(
      path.join(outDir, `__folder-${slugify(cls)}.json`),
      JSON.stringify(f, null, 2) + '\n',
    );
  }
  for (const cls of CLASSES) {
    for (const lvl of LEVELS) {
      const f = buildLevelFolder(cls, lvl);
      await writeFile(
        path.join(outDir, `__folder-${slugify(cls)}-level-${lvl}.json`),
        JSON.stringify(f, null, 2) + '\n',
      );
    }
  }

  // Parse headings + write spell docs
  const parseErrors = [];
  const writtenIds = new Set();
  const collisions = [];
  let docCount = 0;
  let spellCount = 0;
  const perFolder = {};
  for (const cls of CLASSES) {
    perFolder[cls] = {};
    for (const lvl of LEVELS) perFolder[cls][lvl] = 0;
  }

  for (const spell of spells) {
    const parsed = parseSpellHeading(spell.heading);
    if (parsed.parseError || !parsed.pairings) {
      // Wrapper headings (no stat block + no comma in heading) are section
      // intros for nested H4 sub-spells; skip them silently.
      const isWrapper = !spell.statBlock && !spell.heading.includes(',');
      if (!isWrapper) {
        parseErrors.push({ heading: spell.heading, error: parsed.parseError || 'no pairings' });
      }
      continue;
    }
    spell.name = parsed.name;
    spellCount++;
    for (const pairing of parsed.pairings) {
      const { fileSlug, doc } = buildSpellDoc(spell, parsed, pairing);
      if (writtenIds.has(doc._id)) {
        collisions.push({ name: doc.name, id: doc._id, class: pairing.class, level: pairing.level });
        continue;
      }
      writtenIds.add(doc._id);
      await writeFile(
        path.join(outDir, `${fileSlug}.json`),
        JSON.stringify(doc, null, 2) + '\n',
      );
      perFolder[pairing.class][pairing.level]++;
      docCount++;
    }
  }

  const folderCount = CLASSES.length + CLASSES.length * LEVELS.length;
  console.log(`\nGenerated ${docCount} spell documents (${spellCount} unique spells) and ${folderCount} folders.`);
  console.log('\nPer-class / per-level breakdown:');
  const header = 'Class       ' + LEVELS.map(l => `L${l}`.padStart(3)).join(' ');
  console.log('  ' + header);
  for (const cls of CLASSES) {
    const counts = LEVELS.map(l => String(perFolder[cls][l]).padStart(3)).join(' ');
    console.log(`  ${cls.padEnd(12)}${counts}`);
  }
  if (collisions.length) {
    console.log(`\nID collisions (${collisions.length}):`);
    for (const c of collisions) {
      console.log(`  ${c.name} (${c.class} L${c.level}) - ${c.id}`);
    }
  }
  if (parseErrors.length) {
    console.log(`\nHeader parse errors (${parseErrors.length}):`);
    for (const p of parseErrors) {
      console.log(`  ${p.heading} :: ${p.error}`);
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
