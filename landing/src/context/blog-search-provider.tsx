"use client";

import { usePathname } from "@/i18n/navigation";
import { isBlogListingPath } from "@/lib/blog-search";
import type { BlogSearchResult } from "@/types/blog";
import { useLocale, type Locale } from "next-intl";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type SearchState = {
  query: string;
  result?: BlogSearchResult & { query: string; page: number };
  status: "idle" | "loading" | "success" | "error";
};

type BlogSearchContextValue = SearchState & {
  search: (query: string, page?: number) => Promise<void>;
};

export const BlogSearchContext = createContext<BlogSearchContextValue | null>(null);

const SearchProvider = ({
  children,
  locale,
  categorySlug,
}: {
  children: ReactNode;
  locale: Locale;
  categorySlug?: string;
}) => {
  const [state, setState] = useState<SearchState>({ query: "", status: "idle" });
  const request = useRef<AbortController | null>(null);

  useEffect(() => () => request.current?.abort(), []);

  const search = async (value: string, page = 1): Promise<void> => {
    request.current?.abort();
    const query = value.trim();

    if (!query) {
      setState({ query, status: "idle" });
      return;
    }

    const controller = new AbortController();
    request.current = controller;
    setState((previous) => ({ ...previous, query, status: "loading" }));

    const params = new URLSearchParams({ locale, q: query, page: String(page) });
    if (categorySlug) params.set("category", categorySlug);

    try {
      const response = await fetch(`/api/blog/search?${params}`, { signal: controller.signal });
      if (!response.ok) throw new Error(`Search returned ${response.status}`);
      const result: BlogSearchResult = await response.json();
      if (controller.signal.aborted) return;

      setState({ query, result: { ...result, query, page }, status: "success" });
    } catch {
      if (!controller.signal.aborted) {
        setState((previous) => ({ ...previous, query, status: "error" }));
      }
    }
  };

  return <BlogSearchContext value={{ ...state, search }}>{children}</BlogSearchContext>;
};

export const useBlogSearch = () => {
  const context = useContext(BlogSearchContext);
  if (!context) throw new Error("Blog search requires BlogSearchProvider");
  return context;
};

const BlogSearchProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const locale = useLocale();

  if (!isBlogListingPath(pathname)) return children;

  const categorySlug = pathname.startsWith("/blog/category/") ? pathname.split("/")[3] : undefined;

  // A new catalogue page, category, or language starts with an empty search.
  return (
    <SearchProvider key={`${locale}:${pathname}`} locale={locale} categorySlug={categorySlug}>
      {children}
    </SearchProvider>
  );
};

export default BlogSearchProvider;
