import { evaluate, parse } from "groq-js";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { sanityTags } from "../src/sanity/cache-tags.ts";
import { getRevalidationPlan } from "../src/sanity/revalidation.ts";

const empty = { language: null, slug: null, categories: null };
const address = { language: "ru", slug: "article", categories: ["news"] };
const article = { id: "published-article", type: "article", before: address, after: address };
const planFor = (overrides, operation = "update") => getRevalidationPlan({ ...article, ...overrides }, operation);

test("documented webhook filter and projection work for both publication and deletion", async () => {
  const docs = await readFile(new URL("../docs/sanity-webhook.md", import.meta.url), "utf8");
  const [filter, projection] = [...docs.matchAll(/```groq\n([\s\S]*?)\n```/g)].map((match) =>
    parse(match[1], { mode: "delta" }),
  );
  const document = {
    _id: article.id,
    _type: "article",
    language: "ru",
    slug: { current: "article" },
    categories: [{ _ref: "news" }],
  };
  for (const [operation, context] of [
    ["create", { before: null, after: document }],
    ["delete", { before: document, after: null }],
  ]) {
    assert.equal(await (await evaluate(filter, context)).get(), true);
    const payload = await (await evaluate(projection, context)).get();
    const plan = getRevalidationPlan(payload, operation);
    assert.ok(plan.tags.includes("article:ru:article"));
    assert.deepEqual(plan.paths, ["/ru/blog/article"]);
  }
});

test("sanityFetch caches without TTL and bypasses CDN during builds", async () => {
  const keys = ["NEXT_PUBLIC_SANITY_PROJECT_ID", "NEXT_PUBLIC_SANITY_DATASET", "NEXT_PHASE"];
  const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "testproject";
  process.env.NEXT_PUBLIC_SANITY_DATASET = "production";
  delete process.env.NEXT_PHASE;
  const { client, sanityFetch } = await import("../src/sanity/client.ts");
  const originalFetch = client.fetch;
  const calls = [];
  client.fetch = async (_query, _params, options) => {
    calls.push(options);
    return null;
  };
  try {
    await sanityFetch({ query: "*[0]", tags: ["page:ru:faq"] });
    assert.deepEqual(calls[0].next, { revalidate: false, tags: ["page:ru:faq"] });
    assert.equal(calls[0].perspective, "published");
    assert.equal(calls[0].useCdn, true);
    process.env.NEXT_PHASE = "phase-production-build";
    await sanityFetch({ query: "*[0]", tags: ["page:ru:faq"] });
    assert.equal(calls[1].next.revalidate, false);
    assert.equal(calls[1].useCdn, false);
  } finally {
    client.fetch = originalFetch;
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
});

test("body edits refresh one document and its language's lists without invalidating navigation", () => {
  const plan = planFor({});
  assert.deepEqual(plan.tags.sort(), ["article:ru:article", "blog:list:ru"]);
  assert.deepEqual(plan.paths, []);
  assert.equal(plan.immediate, false);
});

test("publication expires a cached missing document; unpublish expires its previous address", () => {
  for (const [operation, overrides] of [
    ["create", { before: empty }],
    ["delete", { after: empty }],
  ]) {
    const plan = planFor(overrides, operation);
    assert.ok(plan.tags.includes(sanityTags.article("ru", "article")));
    assert.ok(plan.tags.includes(sanityTags.languageNavigation));
    assert.deepEqual(plan.paths, ["/ru/blog/article"]);
    assert.equal(plan.immediate, true);
  }
});

test("renaming and moving between languages clears old and new addresses with internal locale paths", () => {
  const plan = planFor({
    type: "partner",
    before: { ...address, language: "uk", slug: "old" },
    after: { ...address, language: "zh", slug: "new" },
  });
  assert.deepEqual(plan.paths, ["/uk/partners/old", "/zh/partners/new"]);
  for (const tag of ["partner:uk:old", "partner:zh:new", "partners:list:uk", "partners:list:zh"])
    assert.ok(plan.tags.includes(tag));
  assert.ok(plan.tags.includes(sanityTags.languageNavigation));
});

test("category membership changes refresh navigation but reordering the same references does not", () => {
  assert.ok(planFor({ after: { ...address, categories: ["guides"] } }).tags.includes(sanityTags.languageNavigation));
  assert.equal(
    planFor({
      before: { ...address, categories: ["news", "guides"] },
      after: { ...address, categories: ["guides", "news"] },
    }).tags.includes(sanityTags.languageNavigation),
    false,
  );
});

test("shared category fields invalidate dependent details and lists in all languages", () => {
  const plan = planFor({
    type: "articleCategory",
    before: { ...empty, slug: "news" },
    after: { ...empty, slug: "news" },
  });
  assert.ok(plan.tags.includes(sanityTags.articleCategories));
  assert.ok(plan.tags.includes("blog:list:en"));
  assert.ok(plan.tags.includes("blog:list:ru"));
  assert.equal(plan.tags.includes(sanityTags.languageNavigation), false);
  const renamed = planFor({
    type: "partnerCategory",
    before: { ...empty, slug: "old" },
    after: { ...empty, slug: "new" },
  });
  assert.ok(renamed.paths.includes("/uk/partners/category/old"));
  assert.ok(renamed.paths.includes("/zh/partners/category/new"));
  assert.ok(renamed.tags.includes(sanityTags.languageNavigation));
});

test("referenced authors, translation metadata, versions and publications target their dependencies", () => {
  for (const [type, expected] of [
    ["author", sanityTags.articleAuthors],
    ["translation.metadata", sanityTags.languageNavigation],
    ["version", sanityTags.versionHistory("ru")],
    ["publication", sanityTags.publications("ru")],
  ]) {
    assert.deepEqual(planFor({ type }).tags, [expected]);
  }
});

test("future page documents use address tags; the version-history page also targets the combined query", () => {
  const plan = planFor({ type: "page", before: empty, after: { ...address, slug: "faq" } }, "create");
  assert.ok(plan.tags.includes(sanityTags.page("ru", "faq")));
  assert.deepEqual(plan.paths, ["/ru/faq"]);
  assert.ok(
    planFor({ type: "page", after: { ...address, slug: "version-history" } }).tags.includes("version-history:ru"),
  );
});
