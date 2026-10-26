# Strapi version-history migration

Approved scope: published entries in all nine locales, directly into Sanity
`production`. Preserve matching document IDs, update content and add missing
locales. All release types are `major`. Keep localized `cover.alt` and map it from
Strapi `title`. Skip `sortOrder` and SEO. Do not create redirects or delete unrelated
content/assets.

Migration steps:

1. Back up existing versions, translation metadata, image metadata and folders.
2. Snapshot every published Strapi version and download original JPEG covers.
3. Validate and transform content; generate a plan preserving existing IDs.
4. Create/reuse the shared `version-history` folder and upload/reuse one cover per
   release with `version-history-<version>.jpg` as its original filename.
5. Import each release's nine published documents and translation links together.
6. Verify complete source/target equality and inspect Studio and the public page.

Credentials are read from `landing/.env.local` and `cms/.env.production`; tokens
are never written to snapshots or reports. All generated data is kept under
gitignored `data/`, including the pre-migration backup and downloaded covers.

Start with `node migrations/version-history/extract.mjs` from `cms/`.
Retain the printed snapshot directory for all subsequent phases. Extraction is
read-only against both CMSes; it writes local snapshot files only.

Commands from `cms/` (replace `<snapshot>` with that directory):

```bash
node --test migrations/version-history/transform.test.mjs
node migrations/version-history/plan.mjs --snapshot <snapshot>
node --experimental-strip-types migrations/version-history/apply.mjs --snapshot <snapshot> --apply-production
node migrations/version-history/verify.mjs --snapshot <snapshot>
node migrations/version-history/validate-schema.mjs --snapshot <snapshot>
```

The plan checks every converted description against its source text and checks
schema-compatible Portable Text. The import guards existing documents by revision,
preserves existing IDs and translation group IDs, and uses deterministic IDs for
new entries. Each release and its nine locales are written atomically. Restarting
against the same snapshot reuses uploads and skips matching documents; concurrent
editor changes cause a stop instead of being overwritten.

New IDs use hyphens: Sanity treats dotted IDs as private paths, so public content
must not use them. Verification compares all version documents with and without
authentication, validates translation references, checks every cover's CDN URL,
and detects source edits made during the migration.

`sanity-before.json` is the pre-import backup. `assets-imported.json` and
`applied-releases.json` record every touched asset, document ID and transaction.
`sanity-after.json` and `verification.json` record target validation. Retain these
files for rollback/review; no existing image assets are deleted.

The completed production run is documented in
[`cms/docs/version-history-migration.md`](../../docs/version-history-migration.md).

## Flatten existing version folders

`flatten-media-folders.mjs` moves the imported covers from `version-history/<version>`
to `version-history` and removes the empty release folders in one transaction.
It backs up the current state, guards revisions and unrelated references, and
checks that asset IDs, URLs, other metadata and version documents stay unchanged.
Blog/article folders are not modified. The operation is safe to rerun.

```bash
node migrations/version-history/flatten-media-folders.mjs --snapshot <snapshot>
node migrations/version-history/flatten-media-folders.mjs --snapshot <snapshot> --apply-production
```

To use an existing Sanity CLI login instead of the token in `.env.local`:

```bash
npx sanity exec migrations/version-history/flatten-media-folders.mjs --with-user-token -- --snapshot <snapshot> --apply-production
```

The CLI supplies `SANITY_AUTH_TOKEN` through the environment; no token is included
in command arguments or reports. Results are saved in `media-flatten-verification.json`.
