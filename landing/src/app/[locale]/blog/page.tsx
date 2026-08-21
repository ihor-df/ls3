import Container from "@/components/atoms/container";
import Heading from "@/components/atoms/heading";
import BlogSearch from "@/components/molecules/blog-search";
import Blog from "@/components/pages/blog";
import { routing } from "@/i18n/routing";
import { ARTICLES_PER_PAGE, SANITY_REVALIDATE_TIME } from "@/lib/constants";
import { sanityFetch } from "@/sanity/client";
import type { ARTICLES_QUERY_RESULT } from "@/sanity/sanity.types";
import { LocaleParams } from "@/types/common";
import { ARTICLES_COUNT_QUERY, CATEGORIES_QUERY, getArticlesQuery } from "./queries";

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

  const [posts, totalArticles, categories] = await Promise.all([
    sanityFetch({
      params: articleParams,
      query: getArticlesQuery(limit),
      revalidate: SANITY_REVALIDATE_TIME,
    }) as Promise<ARTICLES_QUERY_RESULT>,
    sanityFetch({
      params: articleParams,
      query: ARTICLES_COUNT_QUERY,
      revalidate: SANITY_REVALIDATE_TIME,
    }),
    sanityFetch({
      params: { locale },
      query: CATEGORIES_QUERY,
      revalidate: SANITY_REVALIDATE_TIME,
    }),
  ]);

  return (
    <Container as="main">
      <div className="justify-between md:flex">
        <Heading variant="page">Blog</Heading>
        <BlogSearch className="max-md:hidden" initialValue={search} />
      </div>

      <Blog
        locale={locale}
        posts={posts ?? []}
        categories={categories ?? []}
        currentPage={page}
        hasMore={posts.length < totalArticles}
      />
    </Container>
  );
};

export default Page;
