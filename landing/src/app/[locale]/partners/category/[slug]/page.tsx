import { routing } from "@/i18n/routing";
import type { LocaleSlugParams } from "@/types/common";
import { getPartnerCategories } from "../../data";
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

export default async function Page({ params }: { params: LocaleSlugParams }) {
  const { locale, slug } = await params;

  return <PartnersListing locale={locale} page={1} categorySlug={slug} />;
}
