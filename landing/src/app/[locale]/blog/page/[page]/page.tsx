import { getPageQuery } from "@/app/[locale]/api";
import { generatePaginationPageMetadata } from "@/helpers/metadata/generate-pagination-metadata";
import { routing } from "@/i18n/routing";
import { ARTICLES_PER_PAGE } from "@/lib/constants";
import { getStaticPaginationPages, parsePageNumber } from "@/lib/pagination";
import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getArticlesCount } from "../../data";
import { BlogListing } from "../../listing";

type PageProps = {
  params: Promise<{ locale: Locale; page: string }>;
};

export async function generateStaticParams() {
  const pagesByLocale = await Promise.all(
    routing.locales.map(async (locale) => {
      const total = await getArticlesCount(locale);

      return getStaticPaginationPages(total, ARTICLES_PER_PAGE).map((page) => ({
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
  if (!pageNumber || pageNumber === 1) {
    notFound();
  }

  const data = await getPageQuery("blog", locale);

  return generatePaginationPageMetadata({
    locale,
    pathname: "/blog",
    page: pageNumber,
    title: data?.seo?.title,
    description: data?.seo?.description,
    ogImage: data?.seo?.ogImage,
    noIndex: !!data?.seo?.noIndex,
  });
}

export default async function BlogPaginationPage({ params }: PageProps) {
  const { locale, page } = await params;
  const data = await getPageQuery("blog", locale);

  const pageNumber = parsePageNumber(page);
  if (!pageNumber || pageNumber === 1 || !data) notFound();

  const t = await getTranslations("blog");
  const title = data?.mainTitle ? data.mainTitle : t("title");

  return <BlogListing locale={locale} page={pageNumber} title={title} />;
}
