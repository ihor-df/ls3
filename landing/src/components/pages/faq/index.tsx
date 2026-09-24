"use client";

import {
  FAQ_CATEGORY_SLUGS,
  FAQCategorySlug,
  FAQItemsByCategory,
  isFAQCategorySlug,
} from "@/app/[locale]/(service)/faq/constants";
import CategoryFilters from "@/components/molecules/category-filters";
import FAQ from "@/components/organisms/faq";
import { useState } from "react";

type FAQPageProps = {
  categories: {
    _id: string;
    title: string;
    slug: FAQCategorySlug;
  }[];
  allLabel: string;
  itemsByCategory: FAQItemsByCategory;
};

const FAQPage = ({ categories, allLabel, itemsByCategory }: FAQPageProps) => {
  const [activeCategory, setActiveCategory] = useState<FAQCategorySlug | null>(null);
  const allItems = FAQ_CATEGORY_SLUGS.flatMap((categorySlug) => itemsByCategory[categorySlug]);
  const data = activeCategory ? itemsByCategory[activeCategory] : allItems;
  const handleCategoryChange = (slug: string | null) => {
    if (slug === null || isFAQCategorySlug(slug)) setActiveCategory(slug);
  };

  return (
    <>
      <div className="mt-10 flex flex-col">
        <CategoryFilters
          page="faq"
          allLabel={allLabel}
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      <FAQ key={activeCategory ?? "all"} className="mt-10 md:mt-16" data={data} schemaData={allItems} />
    </>
  );
};

export default FAQPage;
