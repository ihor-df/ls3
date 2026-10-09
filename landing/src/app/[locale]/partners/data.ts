import { PARTNERS_PER_PAGE } from "@/lib/constants";
import { getPageCount, getPageOffset } from "@/lib/pagination";
import { sanityTags } from "@/sanity/cache-tags";
import { sanityFetch } from "@/sanity/client";
import type { PARTNERS_QUERY_RESULT } from "@/sanity/sanity.types";
import type { Locale } from "next-intl";
import { getPartnersQuery, PARTNER_CATEGORIES_QUERY, PARTNERS_COUNT_QUERY } from "./api";

type PartnerFilters = {
  categoryId?: string;
  searchQuery?: string;
};

type PartnerPaginationOptions = PartnerFilters & {
  page?: number;
};

const getPartnerParams = (locale: Locale, { categoryId, searchQuery }: PartnerFilters) => {
  const search = searchQuery?.trim();

  return {
    locale,
    categoryId: categoryId ?? null,
    search: search ? `*${search}*` : null,
  };
};

export const getPartnersCount = (locale: Locale, filters: PartnerFilters = {}) =>
  sanityFetch({
    query: PARTNERS_COUNT_QUERY,
    tags: [sanityTags.partnersList(locale)],
    params: getPartnerParams(locale, filters),
    perspective: "published",
    stega: false,
  });

export const getPartnerCategories = (locale: Locale) =>
  sanityFetch({
    query: PARTNER_CATEGORIES_QUERY,
    tags: [sanityTags.partnersList(locale), sanityTags.partnerCategories],
    params: { locale },
    perspective: "published",
    stega: false,
  });

export async function getPartnersData(locale: Locale, { page = 1, ...filters }: PartnerPaginationOptions = {}) {
  const total = await getPartnersCount(locale, filters);
  const pageCount = getPageCount(total, PARTNERS_PER_PAGE);

  if (page > Math.max(1, pageCount)) {
    return { partners: [], total, pageCount };
  }

  const partners = await sanityFetch<PARTNERS_QUERY_RESULT>({
    query: getPartnersQuery(getPageOffset(page, PARTNERS_PER_PAGE), PARTNERS_PER_PAGE),
    tags: [sanityTags.partnersList(locale), sanityTags.partnerCategories],
    params: getPartnerParams(locale, filters),
    perspective: "published",
    stega: false,
  });

  return { partners, total, pageCount };
}
