# Compendium Tooling

Scripts for authoring and building source-controlled compendium packs.

## Layout

- `packs-src/<pack-name>/*.json` — one source JSON per compendium document. Tracked in git.
- `packs/<pack-name>/` — compiled LevelDB pack. Gitignored, build artifact.
- `dist/packs/<pack-name>/` — same LevelDB written into the dist build for Foundry to load. Gitignored.
- `tools/source/` — raw authoring inputs (e.g. markdown source for parsers). Gitignored — not for distribution.

## Scripts

- `npm run pack` — compile every directory under `packs-src/` to LevelDB, in both `packs/` and `dist/packs/`.
- `npm run unpack` — decompile every LevelDB under `packs/` back into `packs-src/`. Useful for round-tripping edits made in Foundry.
- `npm run build:class-features` — regenerate `packs-src/class-features/` from `tools/source/cnc-classes.md`. Only needed if the markdown source changes.

## Critical workflow rule: quit Foundry before packing

**Foundry holds open file handles on every active compendium pack for the lifetime of the Foundry application process.** Returning to the setup screen does NOT release these handles — only fully quitting Foundry does.

If you run `npm run pack` while Foundry is running:

1. Our script `rm -rf`s `dist/packs/<name>/` to write a clean LevelDB.
2. Foundry's process keeps stale handles to the now-deleted inodes (LOCK, MANIFEST, log, etc.).
3. On next open, Foundry's LevelDB sees inconsistent state, runs a destructive auto-repair, archives files to a `lost/` subdirectory, and ends up with an empty pack.
4. The compendium then shows zero entries no matter how many times you refresh.

**Always fully quit Foundry before `npm run pack`.** On Linux: close the main window so the Electron process exits, or `kill` the PID. Verify with `lsof | grep <packname>` — there should be no `(deleted)` entries.

If you suspect corruption, look for `lost/` inside `dist/packs/<name>/` and inspect `LOG.old` for "Repaired leveldb ... recovered 0 files; 0 bytes".

## Why we don't use `@foundryvtt/foundryvtt-cli`

The official CLI (`@foundryvtt/foundryvtt-cli@3.0.3`, latest as of writing) is locked to `classic-level@^1.4.1`. Foundry 13 ships `classic-level@2.0.0`, which has a different on-disk LevelDB format. Packs written by the CLI cannot be opened by Foundry 13 — Foundry runs auto-repair and erases the data.

We bypass the CLI and use `classic-level@2.0.0` directly. As long as the version pinned in `package.json` matches what Foundry ships, packs will be readable. Verify with:

```bash
diff <(cat node_modules/classic-level/package.json | grep version) \
     <(cat ~/Programs/Foundry-13/foundryapp/resources/app/node_modules/classic-level/package.json | grep version)
```

If Foundry upgrades classic-level in a future release, bump our `package.json` to match.

## Document shape

Each source JSON in `packs-src/<pack>/` must include:

- `_id` — 16-char alphanumeric. Use a deterministic hash for reproducibility (see `tools/build-class-features.js` for an example: `sha1(classSlug:featureSlug).slice(0,16)`).
- `_key` — `"!<collection>!<_id>"`. For Items the collection is `items`. The pack script uses this as the LevelDB key. **A doc without `_key` is silently skipped.**
- `name`, `type`, `img` — standard Foundry fields.
- `system` — the type-specific data shape, matching `src/template.yml`.
- `effects: []`, `folder: null`, `flags: {}`, `ownership: { default: 0 }`.

Do **not** include `_stats` in source JSON. Foundry adds it on document creation; including it in source can cause migration churn.

## Adding a new compendium

1. Create `packs-src/<new-pack-name>/` and add JSON files for each document.
2. Register the pack in `src/system.json`'s `packs` array:
   ```json
   {
     "name": "<new-pack-name>",
     "label": "<Display Name>",
     "path": "packs/<new-pack-name>",
     "type": "Item",
     "system": "castles-and-crusades",
     "ownership": { "PLAYER": "OBSERVER", "ASSISTANT": "OWNER" }
   }
   ```
3. Quit Foundry.
4. `npm run pack`.
5. `npm run build` (or `npm run build:ci` which also runs `pack`) so rollup mirrors `src/` to `dist/`.
6. Launch Foundry — the new compendium will be listed.

## Round-tripping edits made in Foundry

If you make changes to compendium docs through Foundry's UI, you can pull them back into source:

1. Quit Foundry (always).
2. `npm run unpack` — overwrites `packs-src/<pack>/*.json` from the compiled pack.
3. Review the diff and commit if intended.
