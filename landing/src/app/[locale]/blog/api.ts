import { defineQuery } from "next-sanity";

const articleListFilter = /* groq */ `
  _type == "article" &&
  language == $locale &&
  defined(slug.current) &&
  (!defined($search) || title match $search) &&
  (!defined($categoryId) || references($categoryId))
`;

const articleListProjection = /* groq */ `
  _id,
  title,
  slug,
  publishedAt,
  image {
    asset->{_id, url},
    alt,
  },
  categories[]->{
    _id,
    "title": coalesce(
      title[language == $locale][0].value,
      title[language == "en"][0].value
    ),
    "slug": slug.current
  }
`;

export const getArticlesQuery = (limit: number) => {
  return defineQuery(`
    *[
      ${articleListFilter}
    ] | order(publishedAt desc, _id asc)[0...${limit}]{
      ${articleListProjection}
    }
  `);
};

export const ARTICLE_SLUGS_QUERY = defineQuery(`
  *[_type == "article" && defined(slug.current)]{
    "slug": slug.current,
    language
  }`);

export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "articleCategory" && defined(slug.current)]{
    _id,
    "title": coalesce(
      title[language == $locale][0].value,
      title[language == "en"][0].value
    ),
     "slug": slug.current
  }|order(title asc)
`);

export const CATEGORY_QUERY = defineQuery(`
  *[_type == "articleCategory" && slug.current == $slug][0]{
    _id,
    "title": coalesce(
      title[language == $locale][0].value,
      title[language == "en"][0].value
    ),
    "slug": slug.current
  }
`);

export const ARTICLES_QUERY = defineQuery(`
  *[_type == "article" && language == $locale && defined(slug.current)]|order(publishedAt desc)[0...12]{
    ${articleListProjection}
  }
`);

export const ARTICLES_COUNT_QUERY = defineQuery(`
  count(*[
    ${articleListFilter}
  ])
`);

export const ARTICLE_QUERY = defineQuery(`
  *[_type == "article" && language == $locale && slug.current == $slug][0]{
    _id,
    title,
    slug,
    publishedAt,
    body,
    "tableOfContents": body[_type == "block" && style == "h2"]{
      _key,
      "title": coalesce(pt::text(@), "")
    },
    image {
      asset->{_id, url},
      alt,
      caption,
      hotspot,
      crop
    },
    author->{
      _id,
      name,
      "role": coalesce(
        role[language == $locale][0].value,
        role[language == "en"][0].value
      ),
      avatar
    },
    categories[]->{
      _id,
      "title": coalesce(
        title[language == $locale][0].value,
        title[language == "en"][0].value
      ),
      "slug": slug.current,
    },
    faq[]{
      "id":_key,
      question,
      answer
    },
  }
`);
