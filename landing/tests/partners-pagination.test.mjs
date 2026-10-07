import { evaluate, parse } from "groq-js";
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getPartnersQuery,
  PARTNER_CATEGORIES_QUERY,
  PARTNERS_COUNT_QUERY,
  PARTNERS_QUERY,
} from "../src/app/[locale]/partners/api.ts";
import { isPartnersListingPath } from "../src/lib/partners-search.ts";

const createPartner = (
  _id,
  publishedAt,
  { language = "en", categoryId = "proxies", title = _id, description = null, body } = {},
) => ({
  _id,
  _type: "partner",
  language,
  title,
  description,
  body,
  slug: { current: _id },
  publishedAt,
  categories: [{ _type: "reference", _ref: categoryId }],
});

const body = [{ _type: "block", children: [{ _type: "span", text: "Searchword about browser privacy" }] }];
const dataset = [
  createPartner("third", "2026-10-05", { body }),
  createPartner("b-second", "2026-10-06", { description: "Searchword in description" }),
  createPartner("a-first", "2026-10-06", { title: "Searchword in title" }),
  createPartner("ru-partner", "2026-10-07", { language: "ru", body }),
  createPartner("other-category", "2026-10-07", { categoryId: "services", body }),
  { ...createPartner("without-url", "2026-10-07", { categoryId: "no-slug-only" }), slug: undefined },
  { _id: "not-a-partner", _type: "article", language: "en", slug: { current: "article" } },
  ...["proxies", "services", "empty", "no-slug-only"].map((_id) => ({
    _id,
    _type: "partnerCategory",
    slug: { current: _id },
    title: [
      { language: "en", value: _id === "proxies" ? "Proxies" : _id },
      { language: "ru", value: _id === "proxies" ? "Прокси" : _id },
    ],
  })),
];

const runQuery = async (query, params) => (await evaluate(parse(query), { dataset, params })).get();

test("partner list and count share language, category and search filters", async () => {
  for (const [params, expectedIds] of [
    [{ locale: "en", categoryId: "proxies", search: null }, ["a-first", "b-second", "third"]],
    [{ locale: "ru", categoryId: null, search: null }, ["ru-partner"]],
    [{ locale: "en", categoryId: "proxies", search: "*SEARCHWORD*" }, ["a-first", "b-second", "third"]],
    [{ locale: "en", categoryId: "proxies", search: "*missing*" }, []],
  ]) {
    const [partners, total] = await Promise.all([
      runQuery(getPartnersQuery(0, 12), params),
      runQuery(PARTNERS_COUNT_QUERY, params),
    ]);

    assert.deepEqual(
      partners.map(({ _id }) => _id),
      expectedIds,
    );
    assert.equal(total, expectedIds.length);
  }
});

test("partner pages have no duplicates or gaps when publication dates match", async () => {
  const params = { locale: "en", categoryId: "proxies", search: null };
  const pages = await Promise.all([0, 2, 4].map((start) => runQuery(getPartnersQuery(start, 2), params)));

  assert.deepEqual(
    pages.map((partners) => partners.map(({ _id }) => _id)),
    [["a-first", "b-second"], ["third"], []],
  );
});

test("partner search finds descriptions and Portable Text without returning bodies", async () => {
  for (const [search, expectedId] of [
    ["*description*", "b-second"],
    ["*browser privacy*", "third"],
  ]) {
    const params = { locale: "en", categoryId: "proxies", search };
    const [partners, total] = await Promise.all([
      runQuery(getPartnersQuery(0, 12), params),
      runQuery(PARTNERS_COUNT_QUERY, params),
    ]);

    assert.deepEqual(
      partners.map(({ _id }) => _id),
      [expectedId],
    );
    assert.equal(total, 1);
    assert.ok(partners.every((partner) => !("body" in partner)));
  }
});

test("partner categories expose localized counts and exclude categories without public partners", async () => {
  for (const [locale, expected] of [
    [
      "en",
      [
        ["proxies", "Proxies", 3],
        ["services", "services", 1],
      ],
    ],
    ["ru", [["proxies", "Прокси", 1]]],
    ["de", []],
  ]) {
    const categories = await runQuery(PARTNER_CATEGORIES_QUERY, { locale });

    assert.deepEqual(
      categories.map(({ slug, title, partnerCount }) => [slug, title, partnerCount]),
      expected,
    );
    for (const { _id, partnerCount } of categories) {
      assert.equal(partnerCount, await runQuery(PARTNERS_COUNT_QUERY, { locale, categoryId: _id, search: null }));
    }
  }
});

test("partner TypeGen query matches runtime filtering and projection", async () => {
  const params = { locale: "en", categoryId: "proxies", search: "*SEARCHWORD*" };
  assert.deepEqual(await runQuery(PARTNERS_QUERY, params), await runQuery(getPartnersQuery(0, 12), params));
});

test("partners search is available on listing paths and excludes individual partner pages", () => {
  for (const path of [
    "/partners",
    "/partners/page/2",
    "/partners/category/proxies",
    "/partners/category/proxies/page/2",
  ]) {
    assert.equal(isPartnersListingPath(path), true, path);
  }
  for (const path of ["/partners/astro", "/partners/page/0", "/partners/category", "/blog", "/version-history"]) {
    assert.equal(isPartnersListingPath(path), false, path);
  }
});
