"use client";

import { FilterItem } from "@/components/molecules/filter-item";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type CategoryFiltersProps = {
  categories: {
    _id: string;
    title: string | null;
    slug?: string;
  }[];
  page: string;
  className?: string;
  allLabel?: string;
  categoryPath?: string;
  activeCategory?: string | null;
  onCategoryChange?: (slug: string | null) => void;
};

const CategoryFilters = ({
  categories,
  page,
  className,
  allLabel = "All articles",
  categoryPath = "category",
  activeCategory,
  onCategoryChange,
}: CategoryFiltersProps) => {
  const pathname = usePathname();
  const baseUrl = `/${page}`;
  const categoryBaseUrl = categoryPath ? `${baseUrl}/${categoryPath}` : baseUrl;
  const slug = pathname.split(`${categoryBaseUrl}/`)[1];
  const isClientFilter = onCategoryChange !== undefined;

  return (
    <ul className={cn("flex flex-wrap gap-x-6 md:gap-x-8 md:gap-y-5", className)}>
      <FilterItem
        current={isClientFilter ? activeCategory === null : pathname === baseUrl}
        href={isClientFilter ? undefined : baseUrl}
        onClick={isClientFilter ? () => onCategoryChange(null) : undefined}
      >
        {allLabel}
      </FilterItem>

      {categories.map((c) => {
        if (!c.slug) return null;

        return (
          <FilterItem
            current={isClientFilter ? activeCategory === c.slug : slug === c.slug}
            href={isClientFilter ? undefined : `${categoryBaseUrl}/${c.slug}`}
            onClick={isClientFilter ? () => onCategoryChange(c.slug ?? null) : undefined}
            key={c._id}
          >
            {c.title}
          </FilterItem>
        );
      })}
    </ul>
  );
};

export default CategoryFilters;
