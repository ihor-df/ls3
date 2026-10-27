# Media in LS3 Studio

The `sanity-plugin-media` tool manages the existing dataset's assets. It does not
require the paid Sanity Media Library service. Open **Media** in the Studio toolbar
to upload, search, tag, rename, and move assets. Image/file fields use the same
browser and keep the plugin's **Edit Media** action. Direct uploads remain available.

## Folder conventions

| Document    | Folder                                                   |
| ----------- | -------------------------------------------------------- |
| Article     | `blog/<slug>`                                            |
| Version     | `version-history`                                        |
| Partner     | `partners/<slug>`                                        |
| Publication | `publications`                                           |
| Page        | `<slug>`; `/` maps to `home`                             |
| Author      | `authors/<name>` (lowercase, spaces replaced by hyphens) |

These are actual nested `media.folder` documents linked by `parent` references,
not tags containing slashes. Assets refer to the leaf folder at `opt.media.folder`,
using the plugin's native weak-reference format. Folder and tag schemas are
registered by the plugin; manage them in Media rather than the Content editor.

When an editor uploads or selects an unfiled image in a document, the Studio
creates/reuses the folder hierarchy and assigns the image. This applies to covers,
inline body images, and SEO images. For slug-based folders, set the slug before selecting an image;
if it is entered afterward while the image input remains mounted, the assignment
waits for it. The target path is shown below the image field.

Opening a document does not change assets. Existing folder assignments are kept,
so reusing an image elsewhere does not move it out of another article's folder.
Folders created manually in Media are reused by name and parent. Stable IDs and
`createIfNotExists` avoid duplicate folders during concurrent uploads. Assignment
uses `setIfMissing`, preserving tags, other metadata, and concurrent folder moves.

Uploads made directly in Media go into its selected folder. Images added through
an API/import must be assigned explicitly; the Studio input is not a server hook.
The future migration can reuse `ensureMediaFolder` and `assignImageToMediaFolder`
from `lib/mediaFolders.ts`. If a slug changes later, rename/move the existing
folder in Media; the Studio does not move already filed assets automatically.

## Localization

The nine document locales remain configured in `documentInternationalization`:
`en`, `ru`, `pt`, `es`, `fr`, `de`, `tr`, `uk`, `zh`.

Alt text and captions stay on each localized document/image field. Do not enable
`media({locales: ...})` merely to translate documents: that option changes the shape
of global asset metadata and requires a separate existing-asset migration.
All translations with the same version or slug share one folder and can reuse the
same asset. Localized articles with different slugs use their respective paths.

Publications share the `publications` folder, including covers reused by different
publications. A publication card combines its image and title in one link, so its
decorative cover can have empty alt text. The editable `cover.alt` field remains
available for images that convey additional information.

## Verify locally

Run `npm run dev-prod` to review the production dataset in the local Studio.
The configuration itself does not create folders or change existing assets.

1. Open Media; create a parent folder and a child folder. Check nesting and moving
   assets using the folder sidebar.
2. In an article with a slug, upload an image and check `blog/<slug>` in Media.
3. In a version document, select an unfiled image and check `version-history`.
   All releases and locales share this folder; no per-version subfolders are created.
4. Reuse a filed image in another document; its original folder should remain.
5. Check that alt text can differ across document locales and that image cropping,
   hotspot selection, inline images, and the Edit Media action still work.

Automated checks: `npm run test:media`, `npx tsc --noEmit`, and `npm run build`.

## Completed migrations

Version history, publications, and Pages SEO have been imported into production.
See [version history](version-history-migration.md),
[publications](publications-migration.md), and [Pages SEO](pages-seo-migration.md)
for results and local backup locations.
