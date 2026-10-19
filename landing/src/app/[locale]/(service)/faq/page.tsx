import FAQPage from "@/components/pages/faq";
import { generatePageMetadata } from "@/helpers/metadata/generate-page-metadata";
import { routing } from "@/i18n/routing";
import { LocalePageProps, LocaleParams } from "@/types/common";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPageQuery } from "../../api";
import {
  FAQ_CATEGORIES,
  FAQ_CATEGORY_SLUGS,
  FAQ_ITEMS_BY_CATEGORY,
  type FAQCategorySlug,
  type FAQItemsByCategory,
} from "./constants";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const data = await getPageQuery("faq", locale);

  return generatePageMetadata({
    locale,
    pathname: "/faq",
    title: data?.seo?.title,
    description: data?.seo?.description,
    ogImage: data?.seo?.ogImage,
    noIndex: !!data?.seo?.noIndex,
  });
}

const Page = async ({ params }: { params: LocaleParams }) => {
  const { locale } = await params;
  const t = await getTranslations("faq");
  const data = await getPageQuery("faq", locale);

  const title = data?.mainTitle ? data.mainTitle : t("title");

  const categories = FAQ_CATEGORIES.map((category) => ({
    ...category,
    title: t(`topics.${category.slug}`),
  }));

  const getCategoryItems = (categorySlug: FAQCategorySlug) => {
    const itemIds: readonly string[] = FAQ_ITEMS_BY_CATEGORY[categorySlug];

    return itemIds.map((id) => ({
      id,
      question: t(`${categorySlug}.${id}.name`),
      answer: t(`${categorySlug}.${id}.description`),
    }));
  };

  const itemsByCategory = {} as FAQItemsByCategory;
  let totalQuestionsAmount = 0;

  for (const categorySlug of FAQ_CATEGORY_SLUGS) {
    itemsByCategory[categorySlug] = getCategoryItems(categorySlug);
    totalQuestionsAmount += itemsByCategory[categorySlug].length;
  }

  return (
    <FAQPage
      title={title}
      categories={categories}
      itemsByCategory={itemsByCategory}
      totalQuestionsAmount={totalQuestionsAmount}
    />
  );
};

export default Page;
