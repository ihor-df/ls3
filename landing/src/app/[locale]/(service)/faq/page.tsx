import CollectionPageHeader from "@/components/atoms/collection-page-header";
import Container from "@/components/atoms/container";
import FAQPage from "@/components/pages/faq";
import { getTranslations } from "next-intl/server";
import { FAQ_CATEGORIES, FAQ_CATEGORY_SLUGS, FAQ_ITEMS_BY_CATEGORY, FAQItemsByCategory } from "./constants";

const Page = async () => {
  const tCommon = await getTranslations("common.faq");
  const tFAQ = await getTranslations("faq");

  const categories = FAQ_CATEGORIES.map((category) => ({
    ...category,
    title: tFAQ(`topics.${category.slug}`),
  }));

  const itemsByCategory = Object.fromEntries(
    FAQ_CATEGORY_SLUGS.map((categorySlug) => [
      categorySlug,
      (FAQ_ITEMS_BY_CATEGORY[categorySlug] as readonly string[]).map((id) => ({
        id,
        question: tFAQ(`${categorySlug}.${id}.name`),
        answer: tFAQ(`${categorySlug}.${id}.description`),
      })),
    ]),
  ) as FAQItemsByCategory;

  return (
    <Container as="main">
      <CollectionPageHeader title={tCommon("title")} />

      <FAQPage categories={categories} allLabel={tFAQ("allQuestions")} itemsByCategory={itemsByCategory} />
    </Container>
  );
};

export default Page;
