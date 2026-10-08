import { evaluate, parse } from "groq-js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { routing } from "../src/i18n/routing.ts";
import { getLocaleHrefs } from "../src/sanity/helpers.ts";
import { buildLanguageNavigation, LANGUAGE_NAVIGATION_QUERY } from "../src/sanity/language-navigation.ts";

const translations = [
  { language: "en", slug: "original" },
  { language: "ru", slug: "perevod" },
];
const content = {
  documents: [
    { section: "blog", language: "en", slug: "original", categories: ["news"], translations },
    { section: "blog", language: "ru", slug: "perevod", categories: ["news"], translations },
    { section: "blog", language: "en", slug: "untranslated", categories: ["news", "guides"], translations: null },
    // The same slug on another language does not establish a translation relationship.
    { section: "blog", language: "ru", slug: "untranslated", categories: ["guides"], translations: null },
    {
      section: "partners",
      language: "en",
      slug: "partner",
      categories: ["proxies"],
      translations: [{ language: "ru", slug: "partner-ru" }],
    },
    {
      section: "partners",
      language: "ru",
      slug: "partner-ru",
      categories: ["proxies"],
      translations: [{ language: "en", slug: "partner" }],
    },
    {
      section: "partners",
      language: "en",
      slug: "untranslated-partner",
      categories: ["proxies", "en-only-partners"],
      translations: null,
    },
  ],
  categories: [
    { _id: "news", section: "blog", slug: "news" },
    { _id: "guides", section: "blog", slug: "guides" },
    { _id: "proxies", section: "partners", slug: "proxies" },
    { _id: "empty", section: "blog", slug: "empty" },
    { _id: "en-only-partners", section: "partners", slug: "en-only" },
    { _id: "empty-partners", section: "partners", slug: "empty" },
  ],
};

const navigation = buildLanguageNavigation(content, "en");

test("static pages keep their corresponding path for every configured locale", () => {
  const links = getLocaleHrefs("/faq", navigation);
  assert.deepEqual(Object.keys(links), routing.locales);
  assert.ok(Object.values(links).every((href) => href === "/faq"));
});

test("articles and partners use actual translation slugs in both directions", () => {
  assert.deepEqual(getLocaleHrefs("/blog/original", navigation), { en: "/blog/original", ru: "/blog/perevod" });
  const russianNavigation = buildLanguageNavigation(content, "ru");
  assert.deepEqual(getLocaleHrefs("/blog/perevod", russianNavigation), { ru: "/blog/perevod", en: "/blog/original" });
  assert.deepEqual(getLocaleHrefs("/partners/partner", navigation), {
    en: "/partners/partner",
    ru: "/partners/partner-ru",
  });
  assert.deepEqual(getLocaleHrefs("/partners/partner-ru", russianNavigation), {
    ru: "/partners/partner-ru",
    en: "/partners/partner",
  });
});

test("untranslated documents never infer equivalents from matching slugs", () => {
  assert.deepEqual(getLocaleHrefs("/blog/untranslated", navigation), { en: "/blog/untranslated" });
  assert.deepEqual(getLocaleHrefs("/partners/untranslated-partner", navigation), {
    en: "/partners/untranslated-partner",
  });
});

test("categories require published localized content; pagination requires that page to exist", () => {
  assert.deepEqual(getLocaleHrefs("/blog/category/news", navigation), {
    en: "/blog/category/news",
    ru: "/blog/category/news",
  });
  assert.deepEqual(getLocaleHrefs("/blog/category/news/page/2", navigation), { en: "/blog/category/news/page/2" });
  assert.deepEqual(getLocaleHrefs("/blog/category/empty", navigation), {});
  assert.deepEqual(getLocaleHrefs("/partners/category/proxies", navigation), {
    en: "/partners/category/proxies",
    ru: "/partners/category/proxies",
  });
  assert.deepEqual(navigation["/partners/category/proxies/page/2"], { en: "/partners/category/proxies/page/2" });
  assert.deepEqual(getLocaleHrefs("/partners/category/proxies/page/3", navigation), {});
  assert.deepEqual(getLocaleHrefs("/partners/category/en-only", navigation), { en: "/partners/category/en-only" });
  assert.deepEqual(getLocaleHrefs("/partners/category/empty", navigation), {});
  const russianNavigation = buildLanguageNavigation(content, "ru");
  assert.deepEqual(getLocaleHrefs("/partners/category/proxies/page/2", russianNavigation), {});
  assert.deepEqual(getLocaleHrefs("/partners/category/en-only", russianNavigation), {});
});

test("empty root listings are valid but nonexistent pagination pages have no link", () => {
  assert.deepEqual(Object.keys(getLocaleHrefs("/blog", navigation)), routing.locales);
  assert.deepEqual(getLocaleHrefs("/blog/page/2", navigation), { en: "/blog/page/2", ru: "/blog/page/2" });
  assert.deepEqual(getLocaleHrefs("/blog/page/3", navigation), {});
  assert.deepEqual(getLocaleHrefs("/partners/page/2", navigation), { en: "/partners/page/2" });
  assert.deepEqual(Object.keys(getLocaleHrefs("/partners", navigation)), routing.locales);
});

test("existing English-only restrictions remain in effect", () => {
  for (const pathname of ["/privacy-policy", "/license-agreement"]) {
    assert.deepEqual(getLocaleHrefs(pathname, navigation), { en: pathname });
  }
});

for (const [documentType, categoryType, section] of [
  ["article", "articleCategory", "blog"],
  ["partner", "partnerCategory", "partners"],
]) {
  test(`the CMS query resolves ${documentType} translations and excludes unpublished or URL-less targets`, async () => {
    const dataset = [
      {
        _id: "en-post",
        _type: documentType,
        language: "en",
        slug: { current: "original" },
        categories: [{ _ref: "news" }],
      },
      {
        _id: "ru-post",
        _type: documentType,
        language: "ru",
        slug: { current: "perevod" },
        categories: [{ _ref: "news" }],
      },
      { _id: "no-url", _type: documentType, language: "uk" },
      { _id: "news", _type: categoryType, slug: { current: "news" } },
      {
        _id: "metadata",
        _type: "translation.metadata",
        translations: [
          { value: { _ref: "en-post" } },
          { value: { _ref: "ru-post" } },
          { value: { _ref: "unpublished-post", _weak: true } },
          { value: { _ref: "no-url" } },
        ],
      },
    ];
    const result = await (await evaluate(parse(LANGUAGE_NAVIGATION_QUERY), { dataset })).get();
    assert.deepEqual(result.documents.find(({ language }) => language === "en").translations, translations);
    const map = buildLanguageNavigation(result, "en");
    assert.deepEqual(map[`/${section}/original`], {
      en: `/${section}/original`,
      ru: `/${section}/perevod`,
    });
    assert.deepEqual(map[`/${section}/category/news`], {
      en: `/${section}/category/news`,
      ru: `/${section}/category/news`,
    });
  });
}
