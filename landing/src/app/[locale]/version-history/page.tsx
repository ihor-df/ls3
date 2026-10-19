import VersionHistoryPage from "@/components/pages/version-history";
import { generatePageMetadata } from "@/helpers/metadata/generate-page-metadata";
import { routing } from "@/i18n/routing";
import { sanityTags } from "@/sanity/cache-tags";
import { sanityFetch } from "@/sanity/client";
import type { LocalePageProps, LocaleParams } from "@/types/common";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPageQuery } from "../api";
import { VERSION_HISTORY_QUERY } from "./api";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type PageProps = {
  params: LocaleParams;
};

// src/proxy.ts adds X-Robots-Tag: noindex, follow to this page's query-parameter URLs in every locale.
export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const data = await getPageQuery("version-history", locale);

  return generatePageMetadata({
    locale,
    pathname: "/version-history",
    title: data?.seo?.title,
    description: data?.seo?.description,
    ogImage: data?.seo?.ogImage,
    noIndex: !!data?.seo?.noIndex,
  });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations("versionHistory");

  const data = await sanityFetch({
    query: VERSION_HISTORY_QUERY,
    params: { locale },
    tags: [sanityTags.versionHistory(locale), sanityTags.page(locale, "version-history")],
  });

  return (
    <VersionHistoryPage
      title={data.page?.mainTitle ?? t("title")}
      noResults={t("noResults")}
      versions={data.versions}
      locale={locale}
    />
  );
}
