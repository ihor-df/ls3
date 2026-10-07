"use client";

import { BlogSearchContext } from "@/context/blog-search-provider";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export type SearchNavigationMode = "router" | "history";

const usePageSearch = (navigationMode: SearchNavigationMode = "router") => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogSearch = useContext(BlogSearchContext);
  const [isHydrated, setIsHydrated] = useState(false);

  // Static HTML has no query. Match it on hydration before applying the browser URL.
  useEffect(() => setIsHydrated(true), []);
  const query = isHydrated ? searchParams.get("q") : null;

  const submitSearch = (value: string) => {
    const nextQuery = value.trim();
    if (nextQuery === (query ?? "") && !searchParams.has("page")) return;

    const url = new URL(window.location.href);

    if (nextQuery) {
      url.searchParams.set("q", nextQuery);
    } else {
      url.searchParams.delete("q");
    }

    url.searchParams.delete("page");

    const href = `${url.pathname}${url.search}${url.hash}`;

    if (navigationMode === "history") {
      window.history.pushState(null, "", href);
    } else {
      router.push(href);
    }
  };

  if (blogSearch) {
    return {
      query: blogSearch.query,
      submitSearch: (value: string) => void blogSearch.search(value),
      clearSearch: () => void blogSearch.search(""),
    };
  }

  return { query, submitSearch, clearSearch: undefined };
};

export default usePageSearch;
