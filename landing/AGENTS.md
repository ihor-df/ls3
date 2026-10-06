<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Localization

Before adding or editing translations in `messages/`, read and follow `messages/README.md`. Treat `en.json` as the source of truth and `ru.json` as an additional semantic reference where a Russian translation exists.

## SEO and initial rendering

SEO and fast initial rendering are top priorities for all public pages. Treat them as product requirements, not optional polish.

- Keep primary indexable content and crawlable links in the initial server-rendered or prerendered HTML. Client-side code may enhance or filter that content, but should not be the only way it appears.
- Do not assume that an SSG/ISR/SSR label means the important content is in the HTML. After changes to public pages, inspect the production HTML, not just the React Server Components payload, and verify that meaningful content is visible before JavaScript runs.
- Make indexing of pagination, search, and filter URLs intentional. Provide crawlable pagination links and an appropriate canonical/robots strategy when those routes are implemented.
- If an implementation trades SEO or first-render speed for interactivity or convenience, explain the impact and agree on the tradeoff with the user before proceeding.
