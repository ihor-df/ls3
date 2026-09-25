"use client";

import {
  isFAQCategorySlug,
  type FAQCategorySlug,
  type FAQItemsByCategory,
} from "@/app/[locale]/(service)/faq/constants";
import CollectionPageHeader from "@/components/atoms/collection-page-header";
import CategoryFilters from "@/components/molecules/category-filters";
import FAQList from "@/components/organisms/faq-list";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { ComponentProps, useEffect, useState } from "react";

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
  const [activeCategory, setActiveCategory] = useState<FAQCategorySlug | null>(null);
  const tFAQ = useTranslations("faq");

  const allItems = Object.values(itemsByCategory).flat();
  const activeCategoryTitle = categories.find((category) => category.slug === activeCategory)?.title;
  const activeCategoryHeadingId = `faq-${activeCategory}-heading`;

  useEffect(() => {
    const syncCategoryFromHash = () => {
      const slug = window.location.hash.slice(1);

      setActiveCategory(isFAQCategorySlug(slug) ? slug : null);
    };

    syncCategoryFromHash();
    window.addEventListener("popstate", syncCategoryFromHash);

    return () => window.removeEventListener("popstate", syncCategoryFromHash);
  }, []);

  const handleCategoryChange = (slug: string | null) => {
    const nextCategory = slug === null ? null : isFAQCategorySlug(slug) ? slug : null;

    if (nextCategory === activeCategory) return;

    setActiveCategory(nextCategory);

    const url = new URL(window.location.href);
    url.hash = nextCategory ?? "";
    window.history.pushState(null, "", url);
  };

  return (
    <>
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
        <div className="mt-10 flex flex-col gap-10 md:mt-16 md:gap-16">
          {categories.map((category, index) => {
            const headingId = `faq-${category.slug}-heading`;

            return (
              <div key={category._id}>
                <CategoryTitle id={headingId}>{category.title}</CategoryTitle>

                <FAQList
                  id={`faq-${category.slug}`}
                  aria-labelledby={headingId}
                  data={itemsByCategory[category.slug]}
                  schemaData={allItems}
                  renderJsonLd={index === 0}
                  defaultOpenItem={index === 0 ? 0 : null}
                />
              </div>
            );
          })}
        </div>
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
    </>
  );
};

export default FAQPage;
