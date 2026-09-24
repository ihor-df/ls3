import { defineQuery } from "next-sanity";

const publicationListProjection = /* groq */ `
  _id,
  title,
  slug,
  publishedAt,
  url,
  cover {
   asset->{_id, url},
   alt,
   hotspot,
   crop
  },
`;

export const getPublicationsQuery = (limit: number) => {
  if (!Number.isSafeInteger(limit) || limit < 1) {
    throw new Error("Publication query limit must be a positive integer");
  }

  return defineQuery(`
  *[_type == "publication" && language == $locale && defined(slug.current)] 
    | order(publishedAt desc, _id asc)[0...${limit}]{
      ${publicationListProjection}
    }
  `);
};

export const PUBLICATIONS_QUERY = defineQuery(`
  *[_type == "publication" && language == $locale && defined(slug.current)]
    | order(publishedAt desc, _id asc)[0...12]{
      ${publicationListProjection}
    }
`);

export const PUBLICATION_SLUGS_QUERY = defineQuery(`
  *[_type == "publication" && defined(slug.current)]{
    "slug": slug.current,
    language
  }`);
