import Container from "@/components/atoms/container";
import Heading from "@/components/atoms/heading";
import BlogSearch from "@/components/molecules/page-search";
import Category from "@/components/pages/blog";
import { sanityFetch } from "@/sanity/client";

import { routing } from "@/i18n/routing";
import { ARTICLES_PER_PAGE, SANITY_REVALIDATE_TIME } from "@/lib/constants";
import type { ARTICLES_QUERY_RESULT } from "@/sanity/sanity.types";
import { LocaleSlugParams } from "@/types/common";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ARTICLE_CATEGORIES_QUERY, ARTICLE_CATEGORY_QUERY, getArticlesQuery } from "../../api";

export async function generateStaticParams() {
  const categories = await sanityFetch({
    query: ARTICLE_CATEGORIES_QUERY,
    params: { locale: "en" },
    perspective: "published",
    stega: false,
  });

  return categories.flatMap(({ slug }) =>
    routing.locales.map((locale) => ({
      locale,
      slug,
    })),
  );
}

type PageProps = {
  params: LocaleSlugParams;
  searchParams: Promise<{ q?: string; page?: string }>;
};

const Page = async ({ params, searchParams }: PageProps) => {
  const { slug, locale } = await params;
  const { q, page: pageParam } = await searchParams;
  const t = await getTranslations("blog");

  const search = q?.trim() ?? "";
  const parsedPage = Number(pageParam ?? "1");
  const page = Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const limit = page * ARTICLES_PER_PAGE;

  const [category, categories] = await Promise.all([
    sanityFetch({
      params: { slug, locale },
      query: ARTICLE_CATEGORY_QUERY,
      revalidate: SANITY_REVALIDATE_TIME,
    }),
    sanityFetch({
      params: { locale },
      query: ARTICLE_CATEGORIES_QUERY,
      revalidate: SANITY_REVALIDATE_TIME,
    }),
  ]);

  if (!category) {
    notFound();
  }

  const articleParams = {
    locale,
    search: search ? `*${search}*` : null,
    categoryId: category._id,
  };

  const postsWithExtra = (await sanityFetch({
    params: articleParams,
    query: getArticlesQuery(limit + 1),
    revalidate: SANITY_REVALIDATE_TIME,
  })) as ARTICLES_QUERY_RESULT;

  const hasMore = postsWithExtra.length > limit;
  const posts = postsWithExtra.slice(0, limit);

  return (
    <Container as="main">
      <div className="justify-between md:flex">
        <Heading variant="page">{t("title")}</Heading>
        <BlogSearch className="max-md:hidden" initialValue={search} />
      </div>

      <Category
        locale={locale}
        posts={posts ?? []}
        categories={categories ?? []}
        currentPage={page}
        hasMore={hasMore}
      />
    </Container>
  );
};

export default Page;
