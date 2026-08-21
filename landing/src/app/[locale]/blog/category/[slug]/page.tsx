import Container from "@/components/atoms/container";
import Heading from "@/components/atoms/heading";
import SearchInput from "@/components/atoms/search-input";
import Category from "@/components/pages/blog";
import { sanityFetch } from "@/sanity/client";

import { routing } from "@/i18n/routing";
import { SANITY_REVALIDATE_TIME } from "@/lib/constants";
import { LocaleSlugParams } from "@/types/common";
import { notFound } from "next/navigation";
import { CATEGORIES_QUERY, CATEGORY_WITH_ARTICLES_QUERY } from "../../queries";

export async function generateStaticParams() {
  const categories = await sanityFetch({
    query: CATEGORIES_QUERY,
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
  searchParams: Promise<{ page?: string }>;
};

const Page = async ({ params, searchParams }: PageProps) => {
  const { slug, locale } = await params;
  const sParams = await searchParams;

  const category = await sanityFetch({
    params: { slug, locale },
    query: CATEGORY_WITH_ARTICLES_QUERY,
    revalidate: SANITY_REVALIDATE_TIME,
  });

  const categories = await sanityFetch({
    params: { locale },
    query: CATEGORIES_QUERY,
    revalidate: SANITY_REVALIDATE_TIME,
  });

  if (!category) {
    notFound();
  }

  const postsByCategory = category.articles;

  return (
    <Container as="main">
      <div className="justify-between md:flex">
        <Heading variant="page">Blog</Heading>
        <SearchInput className="max-md:hidden" />
      </div>

      <Category locale={locale} posts={postsByCategory ?? []} categories={categories ?? []} />
    </Container>
  );
};

export default Page;
