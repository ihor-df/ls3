"use client";

import { FilterItem } from "@/components/molecules/filter-item";
import { usePathname } from "@/i18n/navigation";
import { CATEGORIES_QUERY_RESULT } from "@/sanity/sanity.types";

type FiltersProps = {
  categories: CATEGORIES_QUERY_RESULT;
};

const Filters = ({ categories }: FiltersProps) => {
  const pathname = usePathname();
  const slug = pathname.split("/blog/category/")[1];

  return (
    <ul className="flex flex-wrap gap-x-6 md:gap-x-8 md:gap-y-5">
      <FilterItem current={pathname === "/blog"} href="/blog">
        All articles
      </FilterItem>

      {categories.map((c) => (
        <FilterItem current={slug === c.slug} href={`/blog/category/${c.slug}`} key={c._id}>
          {c.title}
        </FilterItem>
      ))}
    </ul>
  );
};

export default Filters;
