import { evaluate, parse } from "groq-js";
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ARTICLE_CATEGORIES_QUERY,
  ARTICLES_COUNT_QUERY,
  ARTICLES_QUERY,
  getArticlesQuery,
} from "../src/app/[locale]/blog/api.ts";
import { isBlogListingPath } from "../src/lib/blog-search.ts";
import {
  getPageCount,
  getPageOffset,
  getPaginationItems,
  getPaginationPath,
  getStaticPaginationPages,
  parsePageNumber,
} from "../src/lib/pagination.ts";

test("page numbers use positive safe integers and canonical decimal spelling", () => {
  assert.equal(parsePageNumber(), 1);
  assert.equal(parsePageNumber("1"), 1);
  assert.equal(parsePageNumber("42"), 42);
  assert.equal(parsePageNumber(String(Number.MAX_SAFE_INTEGER)), Number.MAX_SAFE_INTEGER);

  for (const value of ["", "0", "-1", "1.5", "01", "1e2", "+2", " 2 ", "NaN", "Infinity", "9007199254740992"]) {
    assert.equal(parsePageNumber(value), null, String(value));
  }
});

test("page counts handle empty, complete and partial pages", () => {
  for (const [total, pageSize, expected] of [
    [0, 12, 0],
    [1, 12, 1],
    [12, 12, 1],
    [13, 12, 2],
    [25, 12, 3],
    [3, 1, 3],
  ]) {
    assert.equal(getPageCount(total, pageSize), expected);
  }
});

test("page offsets select disjoint ranges", () => {
  assert.equal(getPageOffset(1, 12), 0);
  assert.equal(getPageOffset(2, 12), 12);
  assert.equal(getPageOffset(3, 12), 24);
  assert.equal(getPageOffset(3, 1), 2);
});

test("static pagination params include only pages after the base page", () => {
  assert.deepEqual(getStaticPaginationPages(0, 12), []);
  assert.deepEqual(getStaticPaginationPages(12, 12), []);
  assert.deepEqual(getStaticPaginationPages(25, 12), [2, 3]);
  assert.deepEqual(getStaticPaginationPages(3, 1), [2, 3]);
});

test("pagination paths preserve the base URL of listings and categories", () => {
  for (const basePath of ["/blog", "/blog/category/news", "/partners", "/partners/category/proxies"]) {
    assert.equal(getPaginationPath(basePath, 1), basePath);
    assert.equal(getPaginationPath(basePath, 3), `${basePath}/page/3`);
  }
});

test("pagination windows include the first, current and last pages with appropriate gaps", () => {
  for (const [current, total, expected] of [
    [1, 0, []],
    [1, 1, [1]],
    [2, 2, [1, 2]],
    [2, 3, [1, 2, 3]],
    [1, 20, [1, 2, 3, "ellipsis", 20]],
    [10, 20, [1, "ellipsis", 9, 10, 11, "ellipsis", 20]],
    [19, 20, [1, "ellipsis", 18, 19, 20]],
    [20, 20, [1, "ellipsis", 18, 19, 20]],
  ]) {
    assert.deepEqual(getPaginationItems(current, total), expected);
  }
});

test("pagination windows remain bounded and ordered for every page", () => {
  for (const total of [1, 2, 3, 4, 5, 6, 20, 100]) {
    for (let current = 1; current <= total; current += 1) {
      const items = getPaginationItems(current, total);
      const pages = items.filter((item) => typeof item === "number");

      assert.equal(pages[0], 1);
      assert.equal(pages.at(-1), total);
      assert.ok(pages.includes(current));
      assert.equal(new Set(pages).size, pages.length);
      assert.ok(items.length <= 7);
      for (let index = 1; index < pages.length; index += 1) {
        assert.ok(pages[index] > pages[index - 1]);
      }
      for (let index = 0; index < items.length; index += 1) {
        if (items[index] === "ellipsis") {
          assert.ok(typeof items[index - 1] === "number" && typeof items[index + 1] === "number");
          assert.ok(items[index + 1] - items[index - 1] > 1);
        }
      }
    }
  }
});

test("query bounds reject invalid inputs before interpolation", () => {
  for (const start of [-1, 1.5, NaN, Infinity]) {
    assert.throws(() => getArticlesQuery(start, 12), RangeError);
  }
  for (const limit of [0, -1, 1.5, NaN, Infinity]) {
    assert.throws(() => getArticlesQuery(0, limit), RangeError);
  }
});

const createArticle = (_id, publishedAt, { language = "en", categoryId = "news", title = _id } = {}) => ({
  _id,
  _type: "article",
  language,
  title,
  slug: { current: _id },
  publishedAt,
  categories: [{ _type: "reference", _ref: categoryId }],
});

const dataset = [
  createArticle("third", "2026-10-05"),
  createArticle("b-second", "2026-10-06"),
  createArticle("a-first", "2026-10-06"),
  createArticle("ru-article", "2026-10-07", { language: "ru" }),
  createArticle("other-category", "2026-10-07", { categoryId: "updates" }),
  createArticle("no-slug", "2026-10-07"),
  { _id: "not-an-article", _type: "partner", language: "en", slug: { current: "partner" } },
  ...["news", "updates", "empty", "no-slug-only"].map((_id) => ({
    _id,
    _type: "articleCategory",
    slug: { current: _id },
    title: [
      { language: "en", value: _id === "news" ? "News" : _id },
      { language: "ru", value: _id === "news" ? "Новости" : _id },
    ],
  })),
  { ...createArticle("without-url", "2026-10-07", { categoryId: "no-slug-only" }), slug: undefined },
  { _id: "category-without-slug", _type: "articleCategory" },
];
delete dataset.find((article) => article._id === "no-slug").slug;

const runQuery = async (query, params) => {
  const result = await evaluate(parse(query), { dataset, params });
  return result.get();
};

test("list and count agree for language, category and title search", async () => {
  for (const [params, expectedIds] of [
    [{ locale: "en", categoryId: "news", search: null }, ["a-first", "b-second", "third"]],
    [{ locale: "ru", categoryId: null, search: null }, ["ru-article"]],
    [{ locale: "en", categoryId: null, search: "*SECOND*" }, ["b-second"]],
    [{ locale: "en", categoryId: "missing", search: null }, []],
  ]) {
    const [posts, total] = await Promise.all([
      runQuery(getArticlesQuery(0, 12), params),
      runQuery(ARTICLES_COUNT_QUERY, params),
    ]);
    assert.deepEqual(
      posts.map((post) => post._id),
      expectedIds,
    );
    assert.equal(total, expectedIds.length);
  }
});

test("successive pages have no duplicates or gaps with identical publication dates", async () => {
  const params = { locale: "en", categoryId: "news", search: null };
  const pages = await Promise.all([0, 2, 4].map((start) => runQuery(getArticlesQuery(start, 2), params)));

  assert.deepEqual(
    pages.map((posts) => posts.map((post) => post._id)),
    [["a-first", "b-second"], ["third"], []],
  );
});

test("the TypeGen query has the same projection and filtering as runtime queries", async () => {
  const params = { locale: "en", categoryId: "news", search: null };
  assert.deepEqual(await runQuery(ARTICLES_QUERY, params), await runQuery(getArticlesQuery(0, 12), params));
});

test("categories include only articles with URLs in the selected language and expose accurate counts", async () => {
  for (const [locale, expected] of [
    [
      "en",
      [
        ["news", "News", 3],
        ["updates", "updates", 1],
      ],
    ],
    ["ru", [["news", "Новости", 1]]],
    ["de", []],
  ]) {
    const categories = await runQuery(ARTICLE_CATEGORIES_QUERY, { locale });
    assert.deepEqual(
      categories.map(({ slug, title, articleCount }) => [slug, title, articleCount]),
      expected,
    );

    for (const { _id, articleCount } of categories) {
      assert.equal(articleCount, await runQuery(ARTICLES_COUNT_QUERY, { locale, categoryId: _id, search: null }));
    }
  }
});

test("search matches Portable Text without leaking article bodies and respects language and category", async () => {
  const body = [{ _type: "block", children: [{ _type: "span", text: "A unique bodykeyword about browser privacy" }] }];
  const searchDataset = [
    { ...createArticle("body-only", "2026-10-07"), body },
    { ...createArticle("other-language", "2026-10-07", { language: "ru" }), body },
    { ...createArticle("other-category", "2026-10-07", { categoryId: "updates" }), body },
    createArticle("title-only", "2026-10-06", { title: "Bodykeyword in title" }),
    createArticle("no-match", "2026-10-05"),
  ];
  const params = { locale: "en", categoryId: "news", search: "*BODYKEYWORD*" };
  const posts = await (await evaluate(parse(getArticlesQuery(0, 12)), { dataset: searchDataset, params })).get();
  const total = await (await evaluate(parse(ARTICLES_COUNT_QUERY), { dataset: searchDataset, params })).get();

  assert.deepEqual(
    posts.map(({ _id }) => _id),
    ["body-only", "title-only"],
  );
  assert.equal(total, 2);
  assert.ok(posts.every((post) => !("body" in post)));
  const phraseParams = { ...params, search: "*browser privacy*" };
  assert.equal(
    await (await evaluate(parse(ARTICLES_COUNT_QUERY), { dataset: searchDataset, params: phraseParams })).get(),
    1,
  );
});

test("blog search is available on listing paths but not individual articles", () => {
  for (const path of ["/blog", "/blog/page/2", "/blog/category/news", "/blog/category/news/page/2"]) {
    assert.equal(isBlogListingPath(path), true, path);
  }
  for (const path of [
    "/blog/article-1",
    "/blog/page/0",
    "/blog/page/01",
    "/blog/category",
    "/version-history",
    "/other/blog",
  ]) {
    assert.equal(isBlogListingPath(path), false, path);
  }
});
