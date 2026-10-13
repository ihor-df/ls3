import { generatePageMetadata } from "@/helpers/generate-page-metadata";
import { routing } from "@/i18n/routing";
import type { LocalePageProps, LocaleParams } from "@/types/common";
import type { Metadata } from "next";
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
  });
}

export default async function Page({ params }: { params: LocaleParams }) {
  const { locale } = await params;

  return <BlogListing locale={locale} page={1} />;
}
