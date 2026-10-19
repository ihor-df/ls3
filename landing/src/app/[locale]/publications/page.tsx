import PublicationsPage from "@/components/pages/publications";
import { generatePageMetadata } from "@/helpers/metadata/generate-page-metadata";
import { PUBLICATIONS_PER_PAGE } from "@/lib/constants";
import { sanityTags } from "@/sanity/cache-tags";
import { sanityFetch } from "@/sanity/client";
import { PUBLICATIONS_QUERY_RESULT } from "@/sanity/sanity.types";
import { LocalePageProps, LocaleParams } from "@/types/common";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPageQuery } from "../api";
import { getPublicationsQuery } from "./api";

type PageProps = {
  params: LocaleParams;
  searchParams: Promise<{ page?: string }>;
};

// src/proxy.ts adds X-Robots-Tag: noindex, follow to this page's query-parameter URLs in every locale.
export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const data = await getPageQuery("publications", locale);

  return generatePageMetadata({
    locale,
    pathname: "/publications",
    title: data?.seo?.title,
    description: data?.seo?.description,
    ogImage: data?.seo?.ogImage,
    noIndex: !!data?.seo?.noIndex,
  });
}

export default async function Page({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;

  const parsedPage = Number(pageParam ?? "1");
  const page = parsedPage > 0 ? parsedPage : 1;
  const limit = page * PUBLICATIONS_PER_PAGE;

  const [t, data, publicationsWithExtra] = await Promise.all([
    getTranslations("publications"),
    getPageQuery("publications", locale),
    sanityFetch({
      params: { locale },
      query: getPublicationsQuery(limit + 1),
      tags: [sanityTags.publications(locale)],
    }) as Promise<PUBLICATIONS_QUERY_RESULT>,
  ]);

  const hasMore = publicationsWithExtra?.length > limit;
  const publications = publicationsWithExtra?.slice(0, limit);

  return (
    <PublicationsPage
      title={data?.mainTitle || t("title")}
      publications={publications ?? []}
      currentPage={page}
      hasMore={hasMore}
      locale={locale}
    />
  );
}
