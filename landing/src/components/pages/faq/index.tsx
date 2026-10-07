"use client";

import {
  isFAQCategorySlug,
  type FAQCategorySlug,
  type FAQItemsByCategory,
} from "@/app/[locale]/(service)/faq/constants";
import Container from "@/components/atoms/container";
import CategoryFilters from "@/components/molecules/category-filters";
import CollectionPageHeader from "@/components/molecules/collection-page-header";
import FAQList from "@/components/organisms/faq-list";
import useHashCategory from "@/hooks/useHashCategory";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { ComponentProps, Fragment } from "react";

type FAQPageProps = {
  categories: {
    _id: string;
    title: string;
    slug: FAQCategorySlug;
  }[];
  itemsByCategory: FAQItemsByCategory;
  totalQuestionsAmount: number;
};

const CategoryTitle = ({ className, children, ...props }: ComponentProps<"h2">) => (
  <h2 {...props} className={cn("mb-5 text-2xl leading-[1.2] font-bold text-white md:text-[2rem]", className)}>
    {children}
  </h2>
);

const FAQPage = ({ categories, itemsByCategory, totalQuestionsAmount }: FAQPageProps) => {
  const [activeCategory, handleCategoryChange] = useHashCategory(isFAQCategorySlug);

  const tFAQ = useTranslations("faq");

  const allItems = Object.values(itemsByCategory).flat();
  const activeCategoryTitle = categories.find((category) => category.slug === activeCategory)?.title;
  const activeCategoryHeadingId = `faq-${activeCategory}-heading`;

  return (
    <Container as="main">
      <div className="flex items-center justify-between gap-5">
        <CollectionPageHeader title={tFAQ("title")} />{" "}
        <span className="text-[3.5rem] leading-none font-bold max-md:hidden">
          ({activeCategory ? itemsByCategory[activeCategory].length : totalQuestionsAmount})
        </span>
      </div>

      <div className="mt-10 flex flex-col">
        <CategoryFilters
          page="faq"
          allLabel={tFAQ("allQuestions")}
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {activeCategory === null ? (
        <ul className="mt-10 flex flex-col md:mt-16">
          {categories.map((category, index) => {
            const headingId = `faq-${category.slug}-heading`;

            return (
              <Fragment key={category._id}>
                <li className="mt-10 first:mt-0 md:mt-16">
                  <CategoryTitle id={headingId}>{category.title}</CategoryTitle>

                  <FAQList
                    id={`faq-${category.slug}`}
                    aria-labelledby={headingId}
                    data={itemsByCategory[category.slug]}
                    schemaData={allItems}
                    renderJsonLd={index === 0}
                    defaultOpenItem={index === 0 ? 0 : null}
                  />
                </li>

                <hr className="mt-10 border-white/10 last:hidden md:mt-16" />
              </Fragment>
            );
          })}
        </ul>
      ) : (
        <div className="mt-10 md:mt-16">
          <CategoryTitle id={activeCategoryHeadingId}>{activeCategoryTitle}</CategoryTitle>

          <FAQList
            key={activeCategory}
            aria-labelledby={activeCategoryHeadingId}
            data={itemsByCategory[activeCategory]}
            schemaData={allItems}
          />
        </div>
      )}
    </Container>
  );
};

export default FAQPage;
