"use client";

import SearchInput from "@/components/atoms/search-input";
import usePageSearch, { type SearchNavigationMode } from "@/hooks/usePageSearch";

type PageSearchProps = {
  className?: string;
  initialValue?: string;
  navigationMode?: SearchNavigationMode;
  maxLength?: number;
};

const PageSearch = ({ className, initialValue = "", navigationMode = "router", maxLength }: PageSearchProps) => {
  const { query, submitSearch, clearSearch } = usePageSearch(navigationMode);

  return (
    <SearchInput
      className={className}
      initialValue={query ?? initialValue}
      onSearch={submitSearch}
      onClear={clearSearch}
      maxLength={maxLength}
    />
  );
};

export default PageSearch;
