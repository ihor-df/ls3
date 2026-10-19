import { generatePageMetadata } from "@/helpers/metadata/generate-page-metadata";
import { routing } from "@/i18n/routing";
import { getLanguageNavigation } from "@/sanity/language-navigation";
import type { LocaleSlugPageProps, LocaleSlugParams } from "@/types/common";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPartnerCategories, getPartnerCategory } from "../../data";
import { PartnersListing } from "../../listing";

export async function generateStaticParams() {
  const categoriesByLocale = await Promise.all(
    routing.locales.map(async (locale) => {
      const categories = await getPartnerCategories(locale);

      return categories.map(({ slug }) => ({ locale, slug }));
    }),
  );

  return categoriesByLocale.flat();
}

export async function generateMetadata({ params }: LocaleSlugPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = await getPartnerCategory(slug, locale);

  if (!category) {
    notFound();
  }

  const pathname = `/partners/category/${category.slug}`;
  const navigation = await getLanguageNavigation(locale);
  const pageLocales = routing.locales.filter((language) => navigation[pathname]?.[language]);

  return generatePageMetadata({
    locale,
    pathname,
    pageLocales,
    title: category.seo?.title || category.title,
    description: category.seo?.description,
    ogImage: category.seo?.ogImage,
    noIndex: !!category.seo?.noIndex,
  });
}

export default async function Page({ params }: { params: LocaleSlugParams }) {
  const { locale, slug } = await params;
  const category = await getPartnerCategory(slug, locale);

  if (!category?.title) {
    notFound();
  }

  return <PartnersListing locale={locale} page={1} categorySlug={slug} title={category.title} />;
}
