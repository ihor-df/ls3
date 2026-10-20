"use client";

import { BlogSearchContext } from "@/context/blog-search-provider";
import { PartnersSearchContext } from "@/context/partners-search-provider";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export type SearchNavigationMode = "router" | "history";

const usePageSearch = (navigationMode: SearchNavigationMode = "router") => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogSearch = useContext(BlogSearchContext);
  const partnersSearch = useContext(PartnersSearchContext);
  const searchContext = blogSearch ?? partnersSearch;
  const [isHydrated, setIsHydrated] = useState(false);

  // Static HTML has no query. Match it on hydration before applying the browser URL.
  useEffect(() => setIsHydrated(true), []);
  const query = isHydrated ? searchParams.get("q") : null;

  const submitSearch = (value: string) => {
    const nextQuery = value.trim();
    const url = new URL(window.location.href);

    if (nextQuery) {
      url.searchParams.set("q", nextQuery);
    } else {
      url.searchParams.delete("q");
    }

    url.searchParams.delete("page");

    // Version history search covers all dates, so remove the inactive period filters from the URL.
    if (nextQuery && url.pathname.endsWith("/version-history")) {
      url.searchParams.delete("year");
      url.searchParams.delete("month");
    }

    if (url.href === window.location.href) return;

    const href = `${url.pathname}${url.search}${url.hash}`;

    if (navigationMode === "history") {
      window.history.pushState(null, "", href);
    } else {
      router.push(href);
    }
  };

  if (searchContext) {
    return {
      query: searchContext.query,
      submitSearch: (value: string) => void searchContext.search(value),
      clearSearch: () => void searchContext.search(""),
    };
  }

  return { query, submitSearch, clearSearch: undefined };
};

export default usePageSearch;
