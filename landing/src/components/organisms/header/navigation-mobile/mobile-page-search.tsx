"use client";

import SearchInputMobile from "@/components/atoms/search-input-mobile";
import usePageSearch from "@/hooks/usePageSearch";
import { CloseButton } from "./components";

type MobilePageSearchProps = {
  isOpen: boolean;
  onOpen: (value: boolean) => void;
};

const MobilePageSearch = ({ isOpen, onOpen }: MobilePageSearchProps) => {
  const { query, submitSearch } = usePageSearch("history");

  const closeSearch = () => {
    submitSearch("");
    onOpen(false);
  };

  return (
    <>
      <SearchInputMobile initialValue={query ?? ""} onSearch={submitSearch} isOpen={isOpen} handleOpen={onOpen} />
      {isOpen && <CloseButton ariaLabel="Hide search" onClick={closeSearch} />}
    </>
  );
};

export default MobilePageSearch;
