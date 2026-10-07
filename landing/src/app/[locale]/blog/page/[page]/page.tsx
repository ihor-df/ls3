import { routing } from "@/i18n/routing";
import { ARTICLES_PER_PAGE } from "@/lib/constants";
import { getStaticPaginationPages, parsePageNumber } from "@/lib/pagination";
import type { Locale } from "next-intl";
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

export default async function Page({ params }: PageProps) {
  const { locale, page } = await params;
  const pageNumber = parsePageNumber(page);

  if (!pageNumber || pageNumber === 1) notFound();

  return <BlogListing locale={locale} page={pageNumber} />;
}
