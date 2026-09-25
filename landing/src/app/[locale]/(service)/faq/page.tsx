import FAQPage from "@/components/pages/faq";
import { routing } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
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

const Page = async () => {
  const tFAQ = await getTranslations("faq");

  const categories = FAQ_CATEGORIES.map((category) => ({
    ...category,
    title: tFAQ(`topics.${category.slug}`),
  }));

  const getCategoryItems = (categorySlug: FAQCategorySlug) => {
    const itemIds: readonly string[] = FAQ_ITEMS_BY_CATEGORY[categorySlug];

    return itemIds.map((id) => ({
      id,
      question: tFAQ(`${categorySlug}.${id}.name`),
      answer: tFAQ(`${categorySlug}.${id}.description`),
    }));
  };

  const itemsByCategory = {} as FAQItemsByCategory;
  let totalQuestionsAmount = 0;

  for (const categorySlug of FAQ_CATEGORY_SLUGS) {
    itemsByCategory[categorySlug] = getCategoryItems(categorySlug);
    totalQuestionsAmount += itemsByCategory[categorySlug].length;
  }

  return (
    <FAQPage categories={categories} itemsByCategory={itemsByCategory} totalQuestionsAmount={totalQuestionsAmount} />
  );
};

export default Page;
