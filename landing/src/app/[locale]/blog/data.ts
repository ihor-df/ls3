import { ARTICLES_PER_PAGE } from "@/lib/constants";
import { getPageCount, getPageOffset } from "@/lib/pagination";
import { sanityTags } from "@/sanity/cache-tags";
import { sanityFetch } from "@/sanity/client";
import type { ARTICLES_QUERY_RESULT } from "@/sanity/sanity.types";
import type { Locale } from "next-intl";
import {
  ARTICLE_CATEGORIES_QUERY,
  ARTICLE_CATEGORY_QUERY,
  ARTICLE_QUERY,
  ARTICLES_COUNT_QUERY,
  getArticlesQuery,
} from "./api";

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
    tags: [sanityTags.blogList(locale)],
    params: getArticleParams(locale, filters),
    perspective: "published",
  });

export const getArticle = async (slug: string, locale: string) => {
  return sanityFetch({
    params: { slug, locale },
    query: ARTICLE_QUERY,
    tags: [sanityTags.article(locale, slug), sanityTags.articleCategories, sanityTags.articleAuthors],
  });
};

export const getArticleCategory = async (slug: string, locale: string) => {
  return sanityFetch({
    query: ARTICLE_CATEGORY_QUERY,
    params: { locale, slug },
    tags: [sanityTags.articleCategories],
  });
};

export const getArticleCategories = (locale: Locale) =>
  sanityFetch({
    query: ARTICLE_CATEGORIES_QUERY,
    tags: [sanityTags.blogList(locale), sanityTags.articleCategories],
    params: { locale },
    perspective: "published",
  });

export async function getArticlesData(locale: Locale, { page = 1, ...filters }: ArticlePaginationOptions = {}) {
  const total = await getArticlesCount(locale, filters);
  const pageCount = getPageCount(total, ARTICLES_PER_PAGE);

  if (page > Math.max(1, pageCount)) {
    return { posts: [], total, pageCount };
  }

  const posts = await sanityFetch<ARTICLES_QUERY_RESULT>({
    query: getArticlesQuery(getPageOffset(page, ARTICLES_PER_PAGE), ARTICLES_PER_PAGE),
    tags: [sanityTags.blogList(locale), sanityTags.articleCategories],
    params: getArticleParams(locale, filters),
    perspective: "published",
  });

  return { posts, total, pageCount };
}
