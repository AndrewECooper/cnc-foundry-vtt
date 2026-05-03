#!/usr/bin/env node
import { ClassicLevel } from 'classic-level';
import { readdir, stat, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..');
const compiledRoot = path.join(repoRoot, 'packs');
const sourceRoot = path.join(repoRoot, 'packs-src');

async function listDirs(root) {
  let entries;
  try {
    entries = await readdir(root);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
  const dirs = [];
  for (const entry of entries) {
    const full = path.join(root, entry);
    const info = await stat(full);
    if (info.isDirectory()) dirs.push(entry);
  }
  return dirs;
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function extractTo(srcDir, destDir) {
  await mkdir(destDir, { recursive: true });
  const db = new ClassicLevel(srcDir, { keyEncoding: 'utf8', valueEncoding: 'json' });
  await db.open();
  let count = 0;
  for await (const [key, value] of db.iterator()) {
    const doc = { ...value, _key: key };
    const nameSlug = slugify(doc.name ?? doc._id ?? key);
    const filename = `${nameSlug || doc._id || key.replace(/[^a-z0-9-]/gi, '-')}.json`;
    await writeFile(path.join(destDir, filename), JSON.stringify(doc, null, 2) + '\n');
    count++;
  }
  await db.close();
  return count;
}

async function main() {
  const packs = await listDirs(compiledRoot);
  if (packs.length === 0) {
    console.log(`No compiled packs found in ${compiledRoot}`);
    return;
  }
  await mkdir(sourceRoot, { recursive: true });
  for (const name of packs) {
    const src = path.join(compiledRoot, name);
    const dest = path.join(sourceRoot, name);
    console.log(`Extracting ${name}: ${src} -> ${dest}`);
    const count = await extractTo(src, dest);
    console.log(`  ${name}: extracted ${count} entries`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
