import { sanityTags } from "@/sanity/cache-tags";
import { sanityFetch } from "@/sanity/client";
import { defineQuery } from "next-sanity";

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[
    _type == "siteSettings" && _id == "siteSettings"][0]{
      "title": coalesce(
        title[language == $locale && value match "*"][0].value,
        title[language == "en" && value match "*"][0].value
      ),
      "description": coalesce(
        description[language == $locale && value match "*"][0].value,
        description[language == "en" && value match "*"][0].value
      )
    }
`);

export const PAGE_QUERY = defineQuery(`
  *[
    _type == "page" &&
      language == $locale &&
      slug.current == $slug
    ][0] {
      mainTitle,
      seo {
        title,
        description,
        ogImage,
        noIndex
      }
    }
`);

export const getPageQuery = async (slug: string, locale: string) => {
  return sanityFetch({
    query: PAGE_QUERY,
    params: { locale, slug },
    tags: [sanityTags.page(locale, slug)],
  });
};
