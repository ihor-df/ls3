"use client";

import SearchInput from "@/components/atoms/search-input";
import usePageSearch, { type SearchNavigationMode } from "@/hooks/usePageSearch";

type PageSearchProps = {
  className?: string;
  initialValue?: string;
  navigationMode?: SearchNavigationMode;
};

const PageSearch = ({ className, initialValue = "", navigationMode = "router" }: PageSearchProps) => {
  const { query, submitSearch } = usePageSearch(navigationMode);

  return <SearchInput className={className} initialValue={query ?? initialValue} onSearch={submitSearch} />;
};

export default PageSearch;
