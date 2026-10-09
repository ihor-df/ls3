import type { Locale } from "next-intl";
import { defineQuery } from "next-sanity";
import { routing } from "../i18n/routing.ts";
import { ARTICLES_PER_PAGE, PARTNERS_PER_PAGE } from "../lib/constants.ts";
import { getPageCount, getPaginationPath } from "../lib/pagination.ts";
import { sanityTags } from "./cache-tags.ts";
import type { LanguageNavigation } from "./helpers.ts";

type Section = "blog" | "partners";
type LanguageNavigationContent = {
  documents: {
    section: Section;
    language: Locale;
    slug: string;
    categories: string[] | null;
    translations: { language: Locale; slug: string }[] | null;
  }[];
  categories: { _id: string; section: Section; slug: string }[];
};

// Only URL fields and category references are needed. Translation metadata identifies
// actual equivalents even when their slugs differ; missing published targets are excluded.
export const LANGUAGE_NAVIGATION_QUERY = defineQuery(`{
  "documents": *[_type in ["article", "partner"] && defined(slug.current)]{
    "section": select(_type == "article" => "blog", "partners"),
    language,
    "slug": slug.current,
    "categories": categories[]._ref,
    "translations": (*[_type == "translation.metadata" && references(^._id)][0]
      .translations[].value->{language, "slug": slug.current})[defined(language) && defined(slug)]
  },
  "categories": *[_type in ["articleCategory", "partnerCategory"] && defined(slug.current)]{
    _id,
    "section": select(_type == "articleCategory" => "blog", "partners"),
    "slug": slug.current
  }
}`);

export function buildLanguageNavigation(content: LanguageNavigationContent, locale: Locale): LanguageNavigation {
  const navigation: LanguageNavigation = {};

  // Keys are paths in the current locale; values are the available translated paths.
  // Keep the current document available even if it has no translation metadata.
  for (const document of content.documents.filter((document) => document.language === locale)) {
    const pathname = `/${document.section}/${document.slug}`;
    navigation[pathname] = { [locale]: pathname };
    for (const translation of document.translations ?? []) {
      navigation[pathname][translation.language] = `/${document.section}/${translation.slug}`;
    }
  }

  for (const section of ["blog", "partners"] as const) {
    const pageSize = section === "blog" ? ARTICLES_PER_PAGE : PARTNERS_PER_PAGE;
    const sectionDocuments = content.documents.filter((document) => document.section === section);
    // Include the section root so the same counting logic covers it and its categories.
    const listings = [
      { _id: null, slug: null },
      ...content.categories.filter((category) => category.section === section),
    ];

    for (const { _id: categoryId, slug } of listings) {
      const basePath = categoryId ? `/${section}/category/${slug}` : `/${section}`;
      const documents = categoryId
        ? sectionDocuments.filter((document) => document.categories?.includes(categoryId))
        : sectionDocuments;
      const pageCounts = Object.fromEntries(
        routing.locales.map((language) => [
          language,
          // Empty root listings still render; empty categories return 404.
          Math.max(
            categoryId ? 0 : 1,
            getPageCount(documents.filter((document) => document.language === language).length, pageSize),
          ),
        ]),
      );

      // Precompute links only for pages that exist in the current locale. Other languages
      // get a link only when they have that page too, so the menu cannot target a 404.
      for (let page = 1; page <= pageCounts[locale]; page++) {
        const pathname = getPaginationPath(basePath, page);
        navigation[pathname] = Object.fromEntries(
          routing.locales.filter((language) => pageCounts[language] >= page).map((language) => [language, pathname]),
        );
      }
    }
  }

  return navigation;
}

export async function getLanguageNavigation(locale: Locale) {
  const { sanityFetch } = await import("./client.ts");
  // Build the map on the server so both menus have real links in the initial HTML.
  // Only structural webhook events expire this shared map.
  const content = await sanityFetch<LanguageNavigationContent>({
    query: LANGUAGE_NAVIGATION_QUERY,
    tags: [sanityTags.languageNavigation],
    perspective: "published",
    stega: false,
  });

  return buildLanguageNavigation(content, locale);
}
