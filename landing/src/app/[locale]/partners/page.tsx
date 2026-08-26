import Container from "@/components/atoms/container";
import Heading from "@/components/atoms/heading";
import PageSearch from "@/components/molecules/page-search";
import Partners from "@/components/pages/partners";

import { routing } from "@/i18n/routing";
import { PARTNERS_PER_PAGE, SANITY_REVALIDATE_TIME } from "@/lib/constants";
import { sanityFetch } from "@/sanity/client";
import type { PARTNERS_QUERY_RESULT } from "@/sanity/sanity.types";
import { LocaleParams } from "@/types/common";
import { getPartnersQuery, PARTNER_CATEGORIES_QUERY } from "./api";

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
  const limit = page * PARTNERS_PER_PAGE;
  const partnerParams = {
    locale,
    search: search ? `*${search}*` : null,
    categoryId: null,
  };

  const [partnersWithExtra, categories] = await Promise.all([
    sanityFetch({
      params: partnerParams,
      query: getPartnersQuery(limit + 1),
      revalidate: SANITY_REVALIDATE_TIME,
    }) as Promise<PARTNERS_QUERY_RESULT>,
    sanityFetch({
      params: { locale },
      query: PARTNER_CATEGORIES_QUERY,
      revalidate: SANITY_REVALIDATE_TIME,
    }),
  ]);

  const hasMore = partnersWithExtra.length > limit;
  const partners = partnersWithExtra.slice(0, limit);

  return (
    <Container as="main">
      <div className="justify-between md:flex">
        <Heading variant="page">Partners</Heading>
        <PageSearch className="max-md:hidden" initialValue={search} />
      </div>

      <Partners
        locale={locale}
        partners={partners ?? []}
        categories={categories ?? []}
        currentPage={page}
        hasMore={hasMore}
      />
    </Container>
  );
};

export default Page;
