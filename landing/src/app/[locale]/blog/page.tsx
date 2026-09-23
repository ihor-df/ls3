import CollectionPageHeader from "@/components/atoms/collection-page-header";
import Container from "@/components/atoms/container";
import Blog from "@/components/pages/blog";
import { routing } from "@/i18n/routing";
import { ARTICLES_PER_PAGE, SANITY_REVALIDATE_TIME } from "@/lib/constants";
import { sanityFetch } from "@/sanity/client";
import type { ARTICLES_QUERY_RESULT } from "@/sanity/sanity.types";
import { LocaleParams } from "@/types/common";
import { getTranslations } from "next-intl/server";
import { ARTICLE_CATEGORIES_QUERY, getArticlesQuery } from "./api";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type PageProps = {
  params: LocaleParams;
  searchParams: Promise<{ q?: string; page?: string }>;
};

const Page = async ({ params, searchParams }: PageProps) => {
  const t = await getTranslations("blog");
  const { locale } = await params;
  const { q, page: pageParam } = await searchParams;

  const search = q?.trim() ?? "";
  const parsedPage = Number(pageParam ?? "1");
  const page = Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const limit = page * ARTICLES_PER_PAGE;

  const articleParams = {
    locale,
    search: search ? `*${search}*` : null,
    categoryId: null,
  };

  const [postsWithExtra, categories] = await Promise.all([
    sanityFetch({
      params: articleParams,
      query: getArticlesQuery(limit + 1),
      revalidate: SANITY_REVALIDATE_TIME,
    }) as Promise<ARTICLES_QUERY_RESULT>,
    sanityFetch({
      params: { locale },
      query: ARTICLE_CATEGORIES_QUERY,
      revalidate: SANITY_REVALIDATE_TIME,
    }),
  ]);

  const hasMore = postsWithExtra.length > limit;
  const posts = postsWithExtra.slice(0, limit);

  return (
    <Container as="main">
      <CollectionPageHeader title={t("title")} initSearchValue={search} />

      <Blog locale={locale} posts={posts ?? []} categories={categories ?? []} currentPage={page} hasMore={hasMore} />
    </Container>
  );
};

export default Page;
