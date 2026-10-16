import { generatePageMetadata } from "@/helpers/metadata/generate-page-metadata";
import { routing } from "@/i18n/routing";
import type { LocalePageProps, LocaleParams } from "@/types/common";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPageQuery } from "../api";
import { BlogListing } from "./listing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const data = await getPageQuery("blog", locale);

  return generatePageMetadata({
    locale,
    pathname: "/blog",
    title: data?.seo?.title,
    description: data?.seo?.description,
    ogImage: data?.seo?.ogImage,
    noIndex: !!data?.seo?.noIndex,
  });
}

export default async function Page({ params }: { params: LocaleParams }) {
  const { locale } = await params;

  const data = await getPageQuery("blog", locale);
  const t = await getTranslations("blog");
  const title = data?.mainTitle ? data.mainTitle : t("title");

  return <BlogListing locale={locale} page={1} title={title} />;
}
