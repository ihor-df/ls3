import { NextRequest } from "next/server";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";

const require = createRequire(import.meta.url);
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "testproject";
process.env.NEXT_PUBLIC_SANITY_DATASET = "production";
process.env.APP_DOMAIN = "ls.app";

const { default: proxy } = require("../src/proxy.ts");
const { routing } = require("../src/i18n/routing.ts");
const { getPathname } = require("../src/i18n/navigation.ts");
const { generatePageMetadata } = require("../src/helpers/metadata/generate-page-metadata.ts");
const { generatePaginationPageMetadata } = require("../src/helpers/metadata/generate-pagination-metadata.ts");
const { client } = require("../src/sanity/client.ts");
const { ARTICLES_PER_PAGE, PARTNERS_PER_PAGE } = require("../src/lib/constants.ts");

const respond = (path) => proxy(new NextRequest(`https://ls.app${path}`, { headers: { "accept-language": "en" } }));

test("public query variants receive noindex across locales and keep their query parameters", () => {
  for (const locale of routing.locales) {
    for (const path of ["/", "/blog", "/faq", "/partners", "/partners/category/proxies/page/2"]) {
      const localizedPath = getPathname({ locale, href: path });
      for (const query of ["?utm_source=test&_gl=tracking", "?search=browser", "?category=proxies", "?page=2"]) {
        const response = respond(`${localizedPath}${query}`);
        assert.equal(response.headers.get("X-Robots-Tag"), "noindex, follow", `${localizedPath}${query}`);
        const target = response.headers.get("x-middleware-rewrite") ?? response.headers.get("location");
        if (target) assert.equal(new URL(target).search, query);
      }
    }
  }
});

test("clean pages, hash-only navigation and internal RSC parameters do not receive query noindex", () => {
  for (const path of ["/blog", "/partners", "/blog#section", "/blog?_rsc=cache-key"]) {
    assert.equal(respond(path).headers.get("X-Robots-Tag"), null, path);
  }
  assert.equal(respond("/blog?_rsc=cache-key&utm_source=test").headers.get("X-Robots-Tag"), "noindex, follow");
});

test("unrelated parameters do not trigger noindex and existing listing rules remain effective", () => {
  for (const locale of routing.locales) {
    for (const path of ["/faq", "/blog", "/partners"]) {
      const localizedPath = getPathname({ locale, href: path });
      assert.equal(respond(`${localizedPath}?topic=payment`).headers.get("X-Robots-Tag"), null);
    }
    for (const path of ["/version-history", "/publications"]) {
      const localizedPath = getPathname({ locale, href: path });
      for (const query of ["?page=2", "?year=2026"]) {
        assert.equal(respond(`${localizedPath}${query}`).headers.get("X-Robots-Tag"), "noindex, follow");
      }
    }
  }
});

test("first-page redirects preserve locale and query parameters before applying query noindex", () => {
  const response = respond("/ua/partners/category/proxies/page/1?utm_source=test");
  assert.equal(response.status, 308);
  assert.equal(response.headers.get("location"), "https://ls.app/ua/partners/category/proxies?utm_source=test");
  assert.equal(
    respond(new URL(response.headers.get("location")).pathname + "?utm_source=test").headers.get("X-Robots-Tag"),
    "noindex, follow",
  );
});

test("partner hubs and categories advertise only the available EN/RU alternates", async () => {
  for (const locale of ["en", "ru", "de"]) {
    const hub = await generatePageMetadata({ locale, pathname: "/partners", pageLocales: ["en", "ru"] });
    assert.deepEqual(hub.alternates.languages, {
      en: "https://ls.app/partners",
      ru: "https://ls.app/ru/partners",
      "x-default": "https://ls.app/partners",
    });
    const category = await generatePageMetadata({
      locale,
      pathname: "/partners/category/proxies",
      pageLocales: ["ru"],
    });
    assert.deepEqual(category.alternates.languages, { ru: "https://ls.app/ru/partners/category/proxies" });
    assert.equal(
      category.alternates.canonical,
      `https://ls.app${getPathname({ locale, href: "/partners/category/proxies" })}`,
    );
  }
});

const createDocuments = (section, counts, pageSize, category) =>
  Object.entries(counts).flatMap(([language, pages]) =>
    Array.from({ length: pages * pageSize }, (_, index) => ({
      section,
      language,
      slug: `${section}-${language}-${index}`,
      categories: [category],
      translations: null,
    })),
  );

const content = {
  documents: [
    ...createDocuments("blog", { en: 3, ru: 2, uk: 2, zh: 1 }, ARTICLES_PER_PAGE, "news"),
    ...createDocuments("partners", { en: 3, ru: 1, de: 2 }, PARTNERS_PER_PAGE, "proxies"),
  ],
  categories: [
    { _id: "news", section: "blog", slug: "news" },
    { _id: "proxies", section: "partners", slug: "proxies" },
  ],
};

test("blog pagination links only to existing localized pages with ISO language keys", async (t) => {
  t.mock.method(client, "fetch", async () => content);
  for (const pathname of ["/blog", "/blog/category/news"]) {
    const metadata = await generatePaginationPageMetadata({ locale: "uk", pathname, page: 2, title: "Page two" });
    assert.deepEqual(metadata.alternates.languages, {
      en: `https://ls.app${pathname}/page/2`,
      ru: `https://ls.app/ru${pathname}/page/2`,
      uk: `https://ls.app/ua${pathname}/page/2`,
      "x-default": `https://ls.app${pathname}/page/2`,
    });
    assert.equal(metadata.alternates.canonical, `https://ls.app/ua${pathname}/page/2`);
    assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
    assert.equal(metadata.title, "Page two");
    const lastPage = await generatePaginationPageMetadata({ locale: "en", pathname, page: 3 });
    assert.deepEqual(lastPage.alternates.languages, {
      en: `https://ls.app${pathname}/page/3`,
      "x-default": `https://ls.app${pathname}/page/3`,
    });
  }
});

test("partner pagination excludes missing RU pages and non-indexable locale alternatives", async (t) => {
  t.mock.method(client, "fetch", async () => content);
  for (const pathname of ["/partners", "/partners/category/proxies"]) {
    const metadata = await generatePaginationPageMetadata({
      locale: "de",
      pathname,
      page: 2,
      pageLocales: ["en", "ru"],
    });
    assert.deepEqual(metadata.alternates.languages, {
      en: `https://ls.app${pathname}/page/2`,
      "x-default": `https://ls.app${pathname}/page/2`,
    });
    assert.equal(metadata.alternates.canonical, `https://ls.app/de${pathname}/page/2`);
  }
});

test("pagination without an English equivalent does not invent an x-default URL", async (t) => {
  t.mock.method(client, "fetch", async () => ({
    ...content,
    documents: createDocuments("blog", { ru: 2 }, ARTICLES_PER_PAGE, "news"),
  }));
  const metadata = await generatePaginationPageMetadata({ locale: "ru", pathname: "/blog", page: 2 });
  assert.deepEqual(metadata.alternates.languages, { ru: "https://ls.app/ru/blog/page/2" });
});
