import VersionHistoryPage from "@/components/pages/version-history";
import { routing } from "@/i18n/routing";
import { sanityTags } from "@/sanity/cache-tags";
import { sanityFetch } from "@/sanity/client";
import type { LocaleParams } from "@/types/common";
import { getTranslations } from "next-intl/server";
import { VERSION_HISTORY_QUERY } from "./api";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type PageProps = {
  params: LocaleParams;
};

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
