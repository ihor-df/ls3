import { PARTNERS_PER_PAGE, SANITY_REVALIDATE_TIME } from "@/lib/constants";
import { getPageCount, getPageOffset } from "@/lib/pagination";
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
    params: getPartnerParams(locale, filters),
    revalidate: SANITY_REVALIDATE_TIME,
    perspective: "published",
    stega: false,
  });

export const getPartnerCategories = (locale: Locale) =>
  sanityFetch({
    query: PARTNER_CATEGORIES_QUERY,
    params: { locale },
    revalidate: SANITY_REVALIDATE_TIME,
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
    params: getPartnerParams(locale, filters),
    revalidate: SANITY_REVALIDATE_TIME,
    perspective: "published",
    stega: false,
  });

  return { partners, total, pageCount };
}
