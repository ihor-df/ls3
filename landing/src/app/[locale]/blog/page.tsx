import Container from "@/components/atoms/container";
import Heading from "@/components/atoms/heading";
import PageSearch from "@/components/molecules/page-search";
import Blog from "@/components/pages/blog";
import { routing } from "@/i18n/routing";
import { ARTICLES_PER_PAGE, SANITY_REVALIDATE_TIME } from "@/lib/constants";
import { sanityFetch } from "@/sanity/client";
import type { ARTICLES_QUERY_RESULT } from "@/sanity/sanity.types";
import { LocaleParams } from "@/types/common";
import { ARTICLE_CATEGORIES_QUERY, getArticlesQuery } from "./api";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type PageProps = {
  params: LocaleParams;
  searchParams: Promise<{ q?: string; page?: string }>;
};

const Page = async ({ params, searchParams }: PageProps) => {
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
      <div className="justify-between md:flex">
        <Heading variant="page">Blog</Heading>
        <PageSearch className="max-md:hidden" initialValue={search} />
      </div>

      <Blog locale={locale} posts={posts ?? []} categories={categories ?? []} currentPage={page} hasMore={hasMore} />
    </Container>
  );
};

export default Page;
