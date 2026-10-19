import { getPartnerCategories, getPartnerCategory } from "@/app/[locale]/partners/data";
import { PartnersListing } from "@/app/[locale]/partners/listing";
import { generatePaginationPageMetadata } from "@/helpers/metadata/generate-pagination-metadata";
import { routing } from "@/i18n/routing";
import { PARTNERS_PER_PAGE } from "@/lib/constants";
import { getStaticPaginationPages, parsePageNumber } from "@/lib/pagination";
import { Metadata } from "next";
import type { Locale } from "next-intl";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: Locale; slug: string; page: string }>;
};

export async function generateStaticParams() {
  const pagesByLocale = await Promise.all(
    routing.locales.map(async (locale) => {
      const categories = await getPartnerCategories(locale);

      return categories.flatMap(({ slug, partnerCount }) =>
        getStaticPaginationPages(partnerCount, PARTNERS_PER_PAGE).map((page) => ({
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

  if (!pageNumber || pageNumber === 1) {
    notFound();
  }

  const category = await getPartnerCategory(slug, locale);

  if (!category) {
    notFound();
  }

  return generatePaginationPageMetadata({
    locale,
    pathname: `/partners/category/${category.slug}`,
    page: pageNumber,
    title: category.seo?.title || category.title,
    description: category.seo?.description,
    ogImage: category.seo?.ogImage,
    noIndex: !!category.seo?.noIndex,
  });
}

export default async function Page({ params }: PageProps) {
  const { locale, slug, page } = await params;
  const category = await getPartnerCategory(slug, locale);

  const pageNumber = parsePageNumber(page);
  if (!pageNumber || pageNumber === 1 || !category?.title) notFound();

  return <PartnersListing locale={locale} page={pageNumber} categorySlug={slug} title={category.title} />;
}
