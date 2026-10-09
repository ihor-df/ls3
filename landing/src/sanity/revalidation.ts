import { routing } from "../i18n/routing.ts";
import { sanityTags } from "./cache-tags.ts";

type Snapshot = {
  language: string | null;
  slug: string | null;
  categories: string[] | null;
};

// Shape of the projection saved in Sanity Manage. Its signature is checked by the route.
export type WebhookPayload = {
  id: string;
  type: string;
  before: Snapshot;
  after: Snapshot;
};

type Address = Snapshot & { language: string; slug: string };
const hasAddress = (snapshot: Snapshot): snapshot is Address => !!snapshot.language && !!snapshot.slug;

const catalogs = {
  article: {
    path: "/blog",
    documentTag: sanityTags.article,
    listTag: sanityTags.blogList,
    categoryTag: sanityTags.articleCategories,
  },
  partner: {
    path: "/partners",
    documentTag: sanityTags.partner,
    listTag: sanityTags.partnersList,
    categoryTag: sanityTags.partnerCategories,
  },
};

const sameCategories = (before: Snapshot, after: Snapshot) => {
  // Only membership matters: reordering categories does not change navigation links.
  const previous = new Set(before.categories ?? []);
  const current = new Set(after.categories ?? []);
  return previous.size === current.size && [...previous].every((id) => current.has(id));
};

export function getRevalidationPlan({ type, before, after }: WebhookPayload, operation: string | null) {
  const tags = new Set<string>();
  const paths = new Set<string>();
  // On create/delete one snapshot has null fields; on rename both addresses are needed.
  const snapshots = [before, after];
  const addresses = snapshots.filter(hasAddress);
  const languages = new Set(snapshots.flatMap(({ language }) => (language ? [language] : [])));
  const addressChanged = before.language !== after.language || before.slug !== after.slug;
  // Creation also expires a cached 404 from a visit before the document was published.
  const immediate = operation !== "update" || addressChanged;

  const addPath = (language: string, prefix: string, slug: string) => {
    // Next.js revalidates rewrite destinations: /uk and /zh, not public /ua and /ch.
    paths.add(`/${language}${prefix}/${encodeURIComponent(slug)}`);
  };

  switch (type) {
    case "article":
    case "partner": {
      const catalog = catalogs[type];
      for (const language of languages) tags.add(catalog.listTag(language));
      for (const { language, slug } of addresses) {
        tags.add(catalog.documentTag(language, slug));
        if (immediate) addPath(language, catalog.path, slug);
      }
      if (immediate || !sameCategories(before, after)) tags.add(sanityTags.languageNavigation);
      break;
    }
    case "articleCategory":
    case "partnerCategory": {
      const catalog = type === "articleCategory" ? catalogs.article : catalogs.partner;
      tags.add(catalog.categoryTag);
      // Category documents contain fields for every language and are shared by all lists.
      for (const language of routing.locales) {
        tags.add(catalog.listTag(language));
        if (immediate) {
          for (const { slug } of snapshots) {
            if (slug) addPath(language, `${catalog.path}/category`, slug);
          }
        }
      }
      if (immediate) tags.add(sanityTags.languageNavigation);
      break;
    }
    case "author":
      tags.add(sanityTags.articleAuthors);
      break;
    case "publication":
    case "version": {
      const collectionTag = type === "version" ? sanityTags.versionHistory : sanityTags.publications;
      for (const language of languages) tags.add(collectionTag(language));
      break;
    }
    case "page":
      for (const { language, slug } of addresses) {
        tags.add(sanityTags.page(language, slug));
        if (slug === "version-history") tags.add(sanityTags.versionHistory(language));
        if (immediate) addPath(language, "", slug);
      }
      break;
    case "translation.metadata":
      tags.add(sanityTags.languageNavigation);
      break;
  }

  return { tags: [...tags], paths: [...paths], immediate };
}
