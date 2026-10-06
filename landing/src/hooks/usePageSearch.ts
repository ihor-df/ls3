"use client";

import { useRouter, useSearchParams } from "next/navigation";

export type SearchNavigationMode = "router" | "history";

const usePageSearch = (navigationMode: SearchNavigationMode = "router") => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

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

  return { query, submitSearch };
};

export default usePageSearch;
