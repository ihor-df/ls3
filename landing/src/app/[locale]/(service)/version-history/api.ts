import { defineQuery } from "next-sanity";

export const VERSION_HISTORY_QUERY = defineQuery(`
  {
    "page": *[
      _type == "page" &&
      language == $locale &&
      slug.current == "version-history"
    ][0] {
      mainTitle
    },
    "versions": *[
      _type == "version" &&
      language == $locale &&
      defined(slug.current) &&
      defined(releaseDate)
    ] | order(releaseDate desc, _id asc) {
      _id,
      version,
      "slug": slug.current,
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
