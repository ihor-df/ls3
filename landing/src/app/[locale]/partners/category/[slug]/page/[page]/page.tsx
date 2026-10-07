import { routing } from "@/i18n/routing";
import { PARTNERS_PER_PAGE } from "@/lib/constants";
import { getStaticPaginationPages, parsePageNumber } from "@/lib/pagination";
import type { Locale } from "next-intl";
import { notFound } from "next/navigation";
import { getPartnerCategories } from "../../../../data";
import { PartnersListing } from "../../../../listing";

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

export default async function Page({ params }: PageProps) {
  const { locale, slug, page } = await params;
  const pageNumber = parsePageNumber(page);

  if (!pageNumber || pageNumber === 1) notFound();

  return <PartnersListing locale={locale} page={pageNumber} categorySlug={slug} />;
}
