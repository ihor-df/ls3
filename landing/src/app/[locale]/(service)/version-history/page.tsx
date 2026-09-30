import VersionHistoryPage from "@/components/pages/version-history";
import { routing } from "@/i18n/routing";
import { sanityFetch } from "@/sanity/client";
import type { LocaleParams } from "@/types/common";
import { getTranslations } from "next-intl/server";
import { VERSIONS_QUERY } from "./api";

const VERSIONS_REVALIDATE_TIME = 60 * 60;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type PageProps = {
  params: LocaleParams;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations("versionHistory");

  const versions = await sanityFetch({
    query: VERSIONS_QUERY,
    params: { locale },
    revalidate: VERSIONS_REVALIDATE_TIME,
  });

  return <VersionHistoryPage title={t("title")} versions={versions} />;
}
