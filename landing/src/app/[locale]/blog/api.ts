import { defineQuery } from "next-sanity";

const articleListFilter = /* groq */ `
  _type == "article" &&
  language == $locale &&
  defined(slug.current) &&
  (!defined($search) || title match $search || body[].children[].text match $search) &&
  (!defined($categoryId) || references($categoryId))
`;

const articleCategoriesProjection = /* groq */ `
  categories[]->{
    _id,
    "title": coalesce(
      title[language == $locale && value match "*"][0].value,
      title[language == "en" && value match "*"][0].value
    ),
    "slug": slug.current
  }
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
  ${articleCategoriesProjection}
`;

export const getArticlesQuery = (start: number, limit: number) => {
  if (!Number.isInteger(start) || start < 0 || !Number.isInteger(limit) || limit < 1) {
    throw new RangeError("Article query requires a non-negative offset and a positive page size");
  }

  const end = start + limit;

  return defineQuery(`
    *[${articleListFilter}] | order(publishedAt desc, _id asc)[${start}...${end}]{
      ${articleListProjection}
    }
  `);
};

export const ARTICLE_SLUGS_QUERY = defineQuery(`
  *[_type == "article" && defined(slug.current)]{
    "slug": slug.current,
    language
  }`);

export const ARTICLE_CATEGORIES_QUERY = defineQuery(`
  *[_type == "articleCategory" && defined(slug.current)]{
    _id,
    "title": coalesce(
      title[language == $locale && value match "*"][0].value,
      title[language == "en" && value match "*"][0].value
    ),
    "slug": slug.current,
    "articleCount": count(*[
      _type == "article" &&
      language == $locale &&
      defined(slug.current) &&
      references(^._id)
    ])
  }[articleCount > 0] | order(title asc)
`);

export const ARTICLE_CATEGORY_QUERY = defineQuery(`
  *[_type == "articleCategory" && slug.current == $slug][0]{
    _id,
    "title": coalesce(
      title[language == $locale && value match "*"][0].value,
      title[language == "en" && value match "*"][0].value
    ),
    "slug": slug.current,
    seo {
        "title": coalesce(
          title[language == $locale && value match "*"][0].value,
          title[language == "en" && value match "*"][0].value
      ),
        "description": coalesce(
          description[language == $locale && value match "*"][0].value,
          description[language == "en" && value match "*"][0].value
      ),
        ogImage,
        noIndex
    }
  }
`);

// Static query for TypeGen. Runtime pagination uses getArticlesQuery with the same fields.
export const ARTICLES_QUERY = defineQuery(`
  *[${articleListFilter}] | order(publishedAt desc, _id asc)[0...12]{
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
    _updatedAt,
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
    ${articleCategoriesProjection},
    faq[]{
      "id":_key,
      question,
      answer
    },
    seo {
      title,
      description,
      ogImage,
      noIndex
    }
  }
`);
