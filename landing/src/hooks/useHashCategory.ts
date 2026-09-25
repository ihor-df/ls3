"use client";

import { useEffect, useState } from "react";

export default function useHashCategory<Category extends string>(isCategory: (slug: string) => slug is Category) {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  useEffect(() => {
    const syncCategoryFromHash = () => {
      const slug = window.location.hash.slice(1);
      setActiveCategory(isCategory(slug) ? slug : null);
    };

    syncCategoryFromHash();
    window.addEventListener("popstate", syncCategoryFromHash);

    return () => window.removeEventListener("popstate", syncCategoryFromHash);
  }, [isCategory]);

  const handleCategoryChange = (slug: string | null) => {
    const nextCategory = slug !== null && isCategory(slug) ? slug : null;
    if (nextCategory === activeCategory) return;

    setActiveCategory(nextCategory);

    const url = new URL(window.location.href);
    url.hash = nextCategory ?? "";
    window.history.pushState(null, "", url);
  };

  return [activeCategory, handleCategoryChange] as const;
}
