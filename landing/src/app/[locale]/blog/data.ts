import { ARTICLES_PER_PAGE, SANITY_REVALIDATE_TIME } from "@/lib/constants";
import { getPageCount, getPageOffset } from "@/lib/pagination";
import { sanityFetch } from "@/sanity/client";
import type { ARTICLES_QUERY_RESULT } from "@/sanity/sanity.types";
import type { Locale } from "next-intl";
import { ARTICLE_CATEGORIES_QUERY, ARTICLES_COUNT_QUERY, getArticlesQuery } from "./api";

type ArticleFilters = {
  categoryId?: string;
  searchQuery?: string;
};

type ArticlePaginationOptions = ArticleFilters & {
  page?: number;
};

const getArticleParams = (locale: Locale, { categoryId, searchQuery }: ArticleFilters) => {
  const search = searchQuery?.trim();

  return {
    locale,
    categoryId: categoryId ?? null,
    search: search ? `*${search}*` : null,
  };
};

export const getArticlesCount = (locale: Locale, filters: ArticleFilters = {}) =>
  sanityFetch({
    query: ARTICLES_COUNT_QUERY,
    params: getArticleParams(locale, filters),
    revalidate: SANITY_REVALIDATE_TIME,
    perspective: "published",
    stega: false,
  });

export const getArticleCategories = (locale: Locale) =>
  sanityFetch({
    query: ARTICLE_CATEGORIES_QUERY,
    params: { locale },
    revalidate: SANITY_REVALIDATE_TIME,
    perspective: "published",
    stega: false,
  });

export async function getArticlesData(locale: Locale, { page = 1, ...filters }: ArticlePaginationOptions = {}) {
  const total = await getArticlesCount(locale, filters);
  const pageCount = getPageCount(total, ARTICLES_PER_PAGE);

  if (page > Math.max(1, pageCount)) {
    return { posts: [], total, pageCount };
  }

  const posts = await sanityFetch<ARTICLES_QUERY_RESULT>({
    query: getArticlesQuery(getPageOffset(page, ARTICLES_PER_PAGE), ARTICLES_PER_PAGE),
    params: getArticleParams(locale, filters),
    revalidate: SANITY_REVALIDATE_TIME,
    perspective: "published",
    stega: false,
  });

  return { posts, total, pageCount };
}
