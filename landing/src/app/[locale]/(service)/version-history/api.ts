import { defineQuery } from "next-sanity";

export const VERSIONS_QUERY = defineQuery(`
  *[
    _type == "version" &&
    language == $locale &&
    defined(slug.current) &&
    defined(releaseDate)
  ] | order(releaseDate desc, _id asc) {
    _id,
    title,
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
`);
