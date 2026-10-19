import { defineQuery } from "next-sanity";

const partnerListFilter = /* groq */ `
  _type == "partner" &&
  language == $locale &&
  defined(slug.current) &&
  (!defined($search) || title match $search || description match $search || body[].children[].text match $search) &&
  (!defined($categoryId) || references($categoryId))
`;

const partnerCategoriesProjection = /* groq */ `
  categories[]->{
    _id,
    "title": coalesce(
      title[language == $locale && value match "*"][0].value,
      title[language == "en" && value match "*"][0].value
    ),
    "slug": slug.current
  }
`;

const partnerListProjection = /* groq */ `
  _id,
  title,
  description,
  slug,
  publishedAt,
  logo {
    asset->{_id, url},
    alt,
  },
  ${partnerCategoriesProjection}
`;

export const getPartnersQuery = (start: number, limit: number) => {
  if (!Number.isInteger(start) || start < 0 || !Number.isInteger(limit) || limit < 1) {
    throw new RangeError("Partner query requires a non-negative offset and a positive page size");
  }

  const end = start + limit;

  return defineQuery(`
    *[${partnerListFilter}] | order(publishedAt desc, _id asc)[${start}...${end}]{
      ${partnerListProjection}
    }
  `);
};

export const PARTNER_SLUGS_QUERY = defineQuery(`
  *[_type == "partner" && defined(slug.current)]{
    "slug": slug.current,
    language
  }`);

export const PARTNER_CATEGORIES_QUERY = defineQuery(`
  *[_type == "partnerCategory" && defined(slug.current)]{
    _id,
    "title": coalesce(
      title[language == $locale && value match "*"][0].value,
      title[language == "en" && value match "*"][0].value
    ),
    "slug": slug.current,
    "partnerCount": count(*[
      _type == "partner" &&
      language == $locale &&
      defined(slug.current) &&
      references(^._id)
    ])
  }[partnerCount > 0] | order(title asc)
`);

export const PARTNER_CATEGORY_QUERY = defineQuery(`
  *[_type == "partnerCategory" && slug.current == $slug][0]{
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

// Static query for TypeGen. Runtime pagination uses getPartnersQuery with the same fields.
export const PARTNERS_QUERY = defineQuery(`
  *[${partnerListFilter}] | order(publishedAt desc, _id asc)[0...12]{
    ${partnerListProjection}
  }
`);

export const PARTNERS_COUNT_QUERY = defineQuery(`
  count(*[
    ${partnerListFilter}
  ])
`);

export const PARTNER_QUERY = defineQuery(`
  *[_type == "partner" && language == $locale && slug.current == $slug][0]{
    _id,
    title,
    description,
    slug,
    discountPercent,
    discountText,
    promoCode,
    url,
    publishedAt,
    body,
    "tableOfContents": body[_type == "block" && style == "h2"]{
      _key,
      "title": coalesce(pt::text(@), "")
    },
    logo {
      asset->{_id, url},
      alt,
      hotspot,
      crop
    },
    ${partnerCategoriesProjection},
    seo {
      title,
      description,
      ogImage,
      noIndex
    }
  }
`);
