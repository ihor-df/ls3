import { routing } from "@/i18n/routing";
import type { LocaleSlugParams } from "@/types/common";
import { getArticleCategories } from "../../data";
import { BlogListing } from "../../listing";

export async function generateStaticParams() {
  const categoriesByLocale = await Promise.all(
    routing.locales.map(async (locale) => {
      const categories = await getArticleCategories(locale);

      return categories.map(({ slug }) => ({ locale, slug }));
    }),
  );

  return categoriesByLocale.flat();
}

export default async function Page({ params }: { params: LocaleSlugParams }) {
  const { locale, slug } = await params;

  return <BlogListing locale={locale} page={1} categorySlug={slug} />;
}
