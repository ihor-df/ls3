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
4. Create/reuse `version-history/<version>` folders and upload/reuse one cover per
   release with `version-history-<version>.jpg` as its original filename.
5. Import each release's nine published documents and translation links together.
6. Verify complete source/target equality and inspect Studio and the public page.

Credentials are read from `landing/.env.local` and `cms/.env.production`; tokens
are never written to snapshots or reports. All generated data is kept under
gitignored `data/`, including the pre-migration backup and downloaded covers.

Start with `node migrations/version-history/extract.mjs` from `cms/`.
Retain the printed snapshot directory for all subsequent phases. Extraction is
read-only against both CMSes; it writes local snapshot files only.
