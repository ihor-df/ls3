import { getPageQuery } from "@/app/[locale]/api";
import { generatePaginationPageMetadata } from "@/helpers/metadata/generate-pagination-metadata";
import { getStaticPaginationPages, parsePageNumber } from "@/helpers/pagination";
import { routing } from "@/i18n/routing";
import { PARTNERS_PER_PAGE } from "@/lib/constants";
import { Metadata } from "next";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getPartnersCount } from "../../data";
import { PartnersListing } from "../../listing";

type PageProps = {
  params: Promise<{ locale: Locale; page: string }>;
};

export async function generateStaticParams() {
  const pagesByLocale = await Promise.all(
    routing.locales.map(async (locale) => {
      const total = await getPartnersCount(locale);

      return getStaticPaginationPages(total, PARTNERS_PER_PAGE).map((page) => ({
        locale,
        page: String(page),
      }));
    }),
  );

  return pagesByLocale.flat();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, page } = await params;
  const pageNumber = parsePageNumber(page);

  const data = await getPageQuery("partners", locale);
  if (!pageNumber || pageNumber === 1) notFound();

  return generatePaginationPageMetadata({
    locale,
    pathname: "/partners",
    pageLocales: ["en", "ru"],
    page: pageNumber,
    title: data?.seo?.title,
    description: data?.seo?.description,
    ogImage: data?.seo?.ogImage,
    // CMS cannot enable indexing outside EN/RU.
    noIndex: (locale !== "en" && locale !== "ru") || !!data?.seo?.noIndex,
  });
}

export default async function Page({ params }: PageProps) {
  const { locale, page } = await params;
  const data = await getPageQuery("partners", locale);

  const pageNumber = parsePageNumber(page);
  if (!pageNumber || pageNumber === 1) notFound();

  const t = await getTranslations("partners");
  const title = data?.mainTitle ? data.mainTitle : t("title");

  return <PartnersListing locale={locale} page={pageNumber} title={title} />;
}
