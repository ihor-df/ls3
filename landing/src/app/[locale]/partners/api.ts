import { defineQuery } from "next-sanity";

const publishedPartnerFilter = /* groq */ `
  _type == "partner" &&
  language == $locale &&
  defined(slug.current)
`;

const partnerListFilter = /* groq */ `
  ${publishedPartnerFilter} &&
  (!defined($search) || title match $search || description match $search || body[].children[].text match $search) &&
  (!defined($categoryId) || references($categoryId))
`;

const orderedPartnerList = /* groq */ `
  *[${partnerListFilter}] | order(publishedAt desc, _id asc)
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
  categories[]->{
    _id,
    "title": coalesce(
      title[language == $locale][0].value,
      title[language == "en"][0].value
    ),
    "slug": slug.current
  }
`;

export const getPartnersQuery = (start: number, limit: number) => {
  if (!Number.isInteger(start) || start < 0 || !Number.isInteger(limit) || limit < 1) {
    throw new RangeError("Partner query requires a non-negative offset and a positive page size");
  }

  const end = start + limit;

  return defineQuery(`
    ${orderedPartnerList}[${start}...${end}]{
      ${partnerListProjection}
    }
  `);
};

export const PARTNER_CATEGORIES_QUERY = defineQuery(`
  *[_type == "partnerCategory" && defined(slug.current)]{
    _id,
    "title": coalesce(
      title[language == $locale][0].value,
      title[language == "en"][0].value
    ),
    "slug": slug.current,
    "partnerCount": count(*[${publishedPartnerFilter} && references(^._id)])
  }[partnerCount > 0] | order(title asc)
`);

export const PARTNER_CATEGORY_QUERY = defineQuery(`
  *[_type == "partnerCategory" && slug.current == $slug][0]{
    _id,
    "title": coalesce(
      title[language == $locale][0].value,
      title[language == "en"][0].value
    ),
    "slug": slug.current
  }
`);

export const PARTNERS_QUERY = defineQuery(`
  ${orderedPartnerList}[0...12]{
    ${partnerListProjection}
  }
`);

export const PARTNER_SLUGS_QUERY = defineQuery(`
  *[_type == "partner" && defined(slug.current)]{
    "slug": slug.current,
    language
  }`);

export const PARTNER_QUERY = defineQuery(`
  *[
    _type == "partner" &&
    language == $locale &&
    slug.current == $slug
  ][0]{
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
    categories[]->{
      _id,
      "title": coalesce(
        title[language == $locale][0].value,
        title[language == "en"][0].value
      ),
      "slug": slug.current
    }
  }
`);

export const PARTNERS_COUNT_QUERY = defineQuery(`
  count(*[
    ${partnerListFilter}
  ])
`);
