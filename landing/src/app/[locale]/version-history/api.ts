import { sanityTags } from "@/sanity/cache-tags";
import { sanityFetch } from "@/sanity/client";
import { defineQuery } from "next-sanity";

export const VERSION_HISTORY_QUERY = defineQuery(`
  {
    "page": *[
      _type == "page" &&
      language == $locale &&
      slug.current == "version-history"
    ][0] {
      mainTitle,
      seo {
        title,
        description,
        ogImage,
        noIndex
      }
    },
    "versions": *[
      _type == "version" &&
      language == $locale &&
      defined(releaseDate)
    ] | order(releaseDate desc, _id asc) {
      _id,
      version,
      releaseType,
      releaseDate,
      body,
      "searchText": coalesce(pt::text(body), ""),
      cover {
        asset->{_id, url},
        alt,
        hotspot,
        crop
      }
    }
  }
`);

export const getVersionsAndPage = async (locale: string) => {
  return sanityFetch({
    query: VERSION_HISTORY_QUERY,
    params: { locale },
    tags: [sanityTags.versionHistory(locale), sanityTags.page(locale, "version-history")],
  });
};
