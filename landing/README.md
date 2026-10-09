This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Blog pagination migration

The blog uses `/blog`, `/blog/page/N`, `/blog/category/{slug}`, and `/blog/category/{slug}/page/N`.
Listing routes are prerendered with webhook invalidation. Published content determines build-time paths;
new paths can be generated on their first request without rebuilding.

- `src/lib/pagination.ts` validates page numbers and calculates counts, offsets, paths, and static page parameters.
- `src/app/[locale]/blog/data.ts` exposes `getArticlesData(locale, options)`, `getArticlesCount(locale, filters)`, and `getArticleCategories(locale)`.
- `src/app/[locale]/blog/listing.tsx` shares rendering and 404 checks across the four listing routes.
- Categories without articles in the selected language are hidden and return 404. Invalid page numbers and out-of-range pages also return 404. `/page/1` permanently redirects to the base catalogue or category URL through `src/proxy.ts`, preserving the language and query parameters.
- Articles and counts share the same language, category, and title/body search filters. Public data uses the published perspective, webhook invalidation.
- `ARTICLES_PER_PAGE` remains `1` for pagination testing. Set it to `12` after validating the new routes.

Run the focused pagination and GROQ checks with `npm run test:blog-pagination` (Node.js 22.6 or newer).

The reusable `PagePagination` component is available in `src/components/molecules/page-pagination.tsx`.
Pass `basePath` for localized, crawlable links, or `onPageChange` for client-side search results.
Button mode also accepts `disabled` while a request is pending. Zero or one page hides the component.
The `/ui` gallery includes first, middle, last, interactive, and disabled examples.

Server listing routes do not read query parameters. `BlogSearchProvider` shares the active query,
result page, and loading state between desktop search, mobile search, and the blog's `index.tsx`.
Search is submitted explicitly and does not modify the URL. Reloading or navigating to another
catalogue page, category, or language resets it. Emptying either search input immediately clears results,
aborts any pending request, and restores the original SSG catalogue without submitting the form.
The server passes the initial articles to the blog component. Initial article cards and pagination links
remain in the prerendered HTML; the CTA is passed as server-rendered children.

Results come from `GET /api/blog/search?locale=en&q=browser&page=2&category=proxy`.
The endpoint validates the locale, category, page, and query (up to 200 characters), and returns only
the current page's article data. The blog's `index.tsx` converts both initial articles and search results
to card data in one place, importing only the image URL builder, not the CMS client. Search covers titles
and Portable Text spans without sending article bodies to the browser. Requests are aborted when another
search starts, search is cleared, or the catalogue changes.
While a request is pending, the previous list and its current page remain visible. A successful response
replaces both together; an empty response replaces the list with a short message. Loading and result-count
messages are not displayed. Errors preserve the previous list and show a message above it.
The endpoint response is `no-store`; its published Sanity data retains webhook tags without a TTL.

Search does not create separate listing URLs. The catalogue remains indexable, and the search API
receives `X-Robots-Tag: noindex, follow`. Other SEO metadata is a later stage.
Legacy query-parameter redirects, sitemap, and robots.txt are outside the current scope.

## Partners pagination migration

The partners catalogue uses `/partners`, `/partners/page/N`, `/partners/category/{slug}`, and
`/partners/category/{slug}/page/N`, following the blog's routing and rendering architecture.
Listing routes are prerendered with webhook invalidation; new valid paths can be generated on their first request.
They do not read server-side query parameters. Pagination uses localized, crawlable `PagePagination` links.

`src/app/[locale]/partners/data.ts` follows the blog's data layer and exposes
`getPartnersData(locale, options)`, `getPartnersCount(locale, filters)`, and `getPartnerCategories(locale)`.
It uses the shared pagination calculations and the published perspective, with webhook invalidation.
List and count queries share language, category, and title/description/Portable Text search filters.
Category counts exclude partners without a URL and categories without partners in the selected language.

`src/app/[locale]/partners/listing.tsx` shares the server-rendered listing following `BlogListing`.
It resolves the active category, fetches a single page, and rejects missing/empty categories and pages
outside the available range. Invalid page numbers also return 404. `/page/1` permanently redirects
to the base catalogue or category URL through `src/proxy.ts`, preserving the language and query parameters.
The existing CTA section is passed as server-rendered children. Initial cards and navigation links remain in HTML.

`PartnersSearchProvider` shares search state between the two search inputs and the partners' `index.tsx`.
Search is submitted explicitly, stays in React state, and resets on reload or catalogue/category/language navigation.
Clearing the input immediately aborts a pending request and restores the original catalogue page.
The previous list remains while loading; successful responses replace both the list and pagination together.
Empty responses hide cards and pagination and show a short message. Errors preserve the previous list and show an error.
Loading text, result counts, and retry controls are not displayed.

Results come from `GET /api/partners/search?locale=en&q=proxy&page=2&category=proxy-services`.
The endpoint validates locale, page, category, and query (up to 200 characters), returns only card fields,
and uses `Cache-Control: no-store` and `X-Robots-Tag: noindex, follow`.
Its published Sanity data keeps webhook tags without a TTL. Search is scoped to the active category and language;
the page component transforms initial partners and search results in one place.
Search does not create listing URLs or change the catalogue's indexing.

`PARTNERS_PER_PAGE` remains `1` for testing. Set it to `12` after validating pagination.
Run the focused GROQ and search-path checks with `npm run test:partners-pagination`.
Legacy query-parameter redirects, sitemap, robots.txt, and further SEO metadata are outside the current scope.

## Sanity webhook

See [setup and cache rules](docs/sanity-webhook.md) for deployment, activation, and future CMS pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
