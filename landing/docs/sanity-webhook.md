# Sanity webhook revalidation

One signed document webhook invalidates separate document, collection and dependency
tags. Pages regenerate on visits, not all at once.

## Activation

1. Set `SANITY_REVALIDATE_SECRET` in Vercel's Production environment to the webhook's
   Secret value. Never prefix it with `NEXT_PUBLIC_` or commit it.
2. Deploy this code. Existing `NEXT_PUBLIC_SANITY_PROJECT_ID` and
   `NEXT_PUBLIC_SANITY_DATASET` must match the webhook project and dataset.
3. Enable the saved webhook in Sanity Manage → project → API → Webhooks.
4. Publish a content edit and check ⋯ → Show attempt log on the webhook card for HTTP 200. Ordinary edits use
   background regeneration; the first visit may still serve the previous content.

Endpoint: `https://ls3x.vercel.app/api/sanity/revalidate`. Update it when the domain changes.
Use POST, dataset `production`, Create/Update/Delete enabled, draft/release-version
events disabled. The content type `version` is still included for version-history.

Filter:

```groq
coalesce(after()._type, before()._type) in [
  "article", "partner", "articleCategory", "partnerCategory",
  "author", "publication", "version", "page", "translation.metadata"
]
```

Projection (matches the saved settings):

```groq
{
  "id": coalesce(after()._id, before()._id),
  "type": coalesce(after()._type, before()._type),
  "before": {
    "language": before().language,
    "slug": before().slug.current,
    "categories": before().categories[]._ref
  },
  "after": {
    "language": after().language,
    "slug": after().slug.current,
    "categories": after().categories[]._ref
  }
}
```

The route checks the webhook secret and signature, then reads `sanity-operation`.
It trusts the filter and projection above, so it does not repeat their validation.
`parseBody` waits three seconds before invalidation for Content Lake eventual consistency.
Processing errors return 500 so Sanity can retry.

## Cache rules

There is no TTL. Tagged data is refreshed through the webhook.
Build queries bypass Sanity CDN; runtime queries use it with `cacheMode: "noStale"`.
This prevents a stale CDN response, including a missing document, from being cached again
after webhook invalidation. The SDK only adds this parameter when CDN is enabled.
Next.js Data Cache can persist
across deployments, so a new build does not guarantee a fresh CMS request.

Tag factories are in `src/sanity/cache-tags.ts`; document rules are in
`src/sanity/revalidation.ts`; signature verification and invalidation are in the API route.

- Article/partner edits invalidate their old/new address tags and the relevant language's
  lists, counts, filters, search and pagination. Category and author edits invalidate
  the queries that reference those documents.
- Language navigation is invalidated only for changes to addresses, publication state,
  category membership or translation metadata. Text edits do not invalidate it.
- Ordinary edits use `revalidateTag(tag, "max")`. Creation, deletion and address changes
  use `{ expire: 0 }` and invalidate the old/new detail paths, including cached 404s.
  Paths use internal locales `/en`, `/uk`, `/zh`, before next-intl rewrites.
- Page documents use `page:<locale>:<slug>`. The version-history query also depends on
  the `version` collection. Tag future page queries with `sanityTags.page(locale, slug)`
  even before a document exists; the slug must match the route path.

Content is refreshed through the webhook, with no timed fallback.
The webhook does not rerun `generateStaticParams`. Existing placeholders still need
CMS queries when their content model is added.

Run `npm run test:sanity-revalidation` for projection and invalidation checks.
