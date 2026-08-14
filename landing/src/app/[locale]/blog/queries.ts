import { defineQuery } from "next-sanity";

export const ARTICLES_QUERY = defineQuery(`
  *[_type == "article" && defined(slug.current)]|order(publishedAt desc)[0...12]{
    _id,
    title,
    slug,
    publishedAt
  }
`);

export const ARTICLE_QUERY = defineQuery(`
  *[_type == "article" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    publishedAt,
    image,
    body
  }
`);

export const ARTICLE_SLUGS_QUERY = defineQuery(`
  *[_type == "article" && defined(slug.current)]{
    "slug": slug.current
  }`);
