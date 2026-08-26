"use client";

import { FilterItem } from "@/components/molecules/filter-item";
import { usePathname } from "@/i18n/navigation";
import { ARTICLE_CATEGORIES_QUERY_RESULT, PARTNER_CATEGORIES_QUERY_RESULT } from "@/sanity/sanity.types";

type CategoryFiltersProps = {
  categories: ARTICLE_CATEGORIES_QUERY_RESULT | PARTNER_CATEGORIES_QUERY_RESULT;
  page: "blog" | "partners";
};

const CategoryFilters = ({ categories, page }: CategoryFiltersProps) => {
  const pathname = usePathname();
  const baseUrl = `/${page}`;
  const slug = pathname.split(`${baseUrl}/category/`)[1];

  return (
    <ul className="flex flex-wrap gap-x-6 md:gap-x-8 md:gap-y-5">
      <FilterItem current={pathname === baseUrl} href={baseUrl}>
        All articles
      </FilterItem>

      {categories.map((c) => (
        <FilterItem current={slug === c.slug} href={`${baseUrl}/category/${c.slug}`} key={c._id}>
          {c.title}
        </FilterItem>
      ))}
    </ul>
  );
};

export default CategoryFilters;
