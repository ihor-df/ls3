import { generatePageMetadata } from "@/helpers/metadata/generate-page-metadata";
import { routing } from "@/i18n/routing";
import type { LocalePageProps, LocaleParams } from "@/types/common";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPageQuery } from "../api";
import { PartnersListing } from "./listing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const data = await getPageQuery("partners", locale);

  return generatePageMetadata({
    locale,
    pathname: "/partners",
    pageLocales: ["en", "ru"],
    title: data?.seo?.title,
    description: data?.seo?.description,
    ogImage: data?.seo?.ogImage,
    // CMS cannot enable indexing outside EN/RU.
    noIndex: (locale !== "en" && locale !== "ru") || !!data?.seo?.noIndex,
  });
}

export default async function Page({ params }: { params: LocaleParams }) {
  const { locale } = await params;
  const data = await getPageQuery("partners", locale);
  const t = await getTranslations("partners");

  const title = data?.mainTitle ? data.mainTitle : t("title");

  return <PartnersListing locale={locale} page={1} title={title} />;
}
