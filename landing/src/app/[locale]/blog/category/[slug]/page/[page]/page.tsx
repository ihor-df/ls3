import { getArticleCategories, getArticleCategory } from "@/app/[locale]/blog/data";
import { BlogListing } from "@/app/[locale]/blog/listing";
import { generatePaginationPageMetadata } from "@/helpers/metadata/generate-pagination-metadata";
import { ARTICLES_PER_PAGE } from "@/lib/constants";
import { getStaticPaginationPages, parsePageNumber } from "@/lib/pagination";

import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: Locale; slug: string; page: string }>;
};

export async function generateStaticParams() {
  const pagesByLocale = await Promise.all(
    routing.locales.map(async (locale) => {
      const categories = await getArticleCategories(locale);

      return categories.flatMap(({ slug, articleCount }) =>
        getStaticPaginationPages(articleCount, ARTICLES_PER_PAGE).map((page) => ({
          locale,
          slug,
          page: String(page),
        })),
      );
    }),
  );

  return pagesByLocale.flat();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug, page } = await params;
  const pageNumber = parsePageNumber(page);
  const category = await getArticleCategory(slug, locale);

  if (!pageNumber || pageNumber === 1 || !category) {
    notFound();
  }

  return generatePaginationPageMetadata({
    locale,
    pathname: `/blog/category/${category.slug}`,
    page: pageNumber,
    title: category.seo?.title || category.title,
    description: category.seo?.description,
    ogImage: category.seo?.ogImage,
    noIndex: !!category.seo?.noIndex,
  });
}

export default async function Page({ params }: PageProps) {
  const { locale, slug, page } = await params;
  const category = await getArticleCategory(slug, locale);

  const pageNumber = parsePageNumber(page);
  if (!pageNumber || pageNumber === 1 || !category?.title) notFound();

  return (
    <BlogListing
      locale={locale}
      page={pageNumber}
      categorySlug={slug}
      title={category.title}
      description={category.seo?.description}
    />
  );
}
