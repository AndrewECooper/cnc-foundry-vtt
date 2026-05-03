#!/usr/bin/env node
import { ClassicLevel } from 'classic-level';
import { readdir, readFile, stat, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..');
const sourceRoot = path.join(repoRoot, 'packs-src');
const stagingRoot = path.join(repoRoot, 'packs');
const distRoot = path.join(repoRoot, 'dist', 'packs');

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

async function compileTo(srcDir, destDir, name) {
  const dest = path.join(destDir, name);
  // Always start clean — copying or merging an existing LevelDB causes Foundry
  // to flag the pack as corrupt and run a destructive repair.
  if (existsSync(dest)) await rm(dest, { recursive: true, force: true });
  await mkdir(dest, { recursive: true });

  const db = new ClassicLevel(dest, { keyEncoding: 'utf8', valueEncoding: 'json' });
  await db.open();

  const files = (await readdir(srcDir)).filter(f => f.endsWith('.json'));
  const batch = db.batch();
  let count = 0;
  for (const file of files) {
    const raw = await readFile(path.join(srcDir, file), 'utf8');
    const doc = JSON.parse(raw);
    if (!doc._key) {
      console.warn(`  skipped ${file}: missing _key`);
      continue;
    }
    const key = doc._key;
    const value = { ...doc };
    delete value._key;
    batch.put(key, value);
    count++;
  }
  await batch.write();

  // Compact so the data ends up in an .ldb table file rather than only the
  // write-ahead log. This matches the layout produced by closing a populated
  // Foundry pack and avoids confusing Foundry's first-open repair pass.
  const firstIter = db.keys({ limit: 1, fillCache: false });
  const first = await firstIter.next();
  await firstIter.close();
  const lastIter = db.keys({ limit: 1, reverse: true, fillCache: false });
  const last = await lastIter.next();
  await lastIter.close();
  if (first && last) await db.compactRange(first, last, { keyEncoding: 'utf8' });

  await db.close();
  console.log(`  ${name}: packed ${count} entries -> ${dest}`);
}

async function main() {
  const packs = await listDirs(sourceRoot);
  if (packs.length === 0) {
    console.log(`No source packs found in ${sourceRoot}`);
    return;
  }
  await mkdir(stagingRoot, { recursive: true });
  const writeDist = existsSync(path.join(repoRoot, 'dist'));
  if (writeDist) await mkdir(distRoot, { recursive: true });
  for (const name of packs) {
    const src = path.join(sourceRoot, name);
    console.log(`\nCompiling ${name}`);
    await compileTo(src, stagingRoot, name);
    if (writeDist) await compileTo(src, distRoot, name);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
