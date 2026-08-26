import Container from "@/components/atoms/container";
import Heading from "@/components/atoms/heading";
import PageSearch from "@/components/molecules/page-search";
import Category from "@/components/pages/partners";
import { routing } from "@/i18n/routing";
import { PARTNERS_PER_PAGE, SANITY_REVALIDATE_TIME } from "@/lib/constants";
import { sanityFetch } from "@/sanity/client";
import type { PARTNERS_QUERY_RESULT } from "@/sanity/sanity.types";
import { LocaleSlugParams } from "@/types/common";
import { notFound } from "next/navigation";
import { getPartnersQuery, PARTNER_CATEGORIES_QUERY, PARTNER_CATEGORY_QUERY } from "../../api";

export async function generateStaticParams() {
  const categories = await sanityFetch({
    query: PARTNER_CATEGORIES_QUERY,
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

  const search = q?.trim() ?? "";
  const parsedPage = Number(pageParam ?? "1");
  const page = Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const limit = page * PARTNERS_PER_PAGE;

  const [category, categories] = await Promise.all([
    sanityFetch({
      params: { slug, locale },
      query: PARTNER_CATEGORY_QUERY,
      revalidate: SANITY_REVALIDATE_TIME,
    }),
    sanityFetch({
      params: { locale },
      query: PARTNER_CATEGORIES_QUERY,
      revalidate: SANITY_REVALIDATE_TIME,
    }),
  ]);

  if (!category) {
    notFound();
  }

  const partnerParams = {
    locale,
    search: search ? `*${search}*` : null,
    categoryId: category._id,
  };

  const partnersWithExtra = (await sanityFetch({
    params: partnerParams,
    query: getPartnersQuery(limit + 1),
    revalidate: SANITY_REVALIDATE_TIME,
  })) as PARTNERS_QUERY_RESULT;
  const hasMore = partnersWithExtra.length > limit;
  const partners = partnersWithExtra.slice(0, limit);

  return (
    <Container as="main">
      <div className="justify-between md:flex">
        <Heading variant="page">Partners</Heading>
        <PageSearch className="max-md:hidden" initialValue={search} />
      </div>

      <Category
        locale={locale}
        partners={partners}
        categories={categories ?? []}
        currentPage={page}
        hasMore={hasMore}
      />
    </Container>
  );
};

export default Page;
