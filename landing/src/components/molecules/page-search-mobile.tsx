"use client";

import SearchInputMobile from "@/components/atoms/search-input-mobile";
import usePageSearch from "@/hooks/usePageSearch";
import { useTranslations } from "next-intl";
import { CloseButton } from "../organisms/header-navigation/navigation-mobile/components";

type MobilePageSearchProps = {
  isOpen: boolean;
  onOpen: (value: boolean) => void;
  maxLength?: number;
};

const MobilePageSearch = ({ isOpen, onOpen, maxLength }: MobilePageSearchProps) => {
  const { query, submitSearch, clearSearch } = usePageSearch("history");
  const t = useTranslations("common.search");

  const closeSearch = () => {
    submitSearch("");
    onOpen(false);
  };

  return (
    <>
      <SearchInputMobile
        initialValue={query ?? ""}
        onSearch={submitSearch}
        onClear={clearSearch}
        isOpen={isOpen}
        handleOpen={onOpen}
        maxLength={maxLength}
      />
      {isOpen && <CloseButton ariaLabel={t("hide")} onClick={closeSearch} />}
    </>
  );
};

export default MobilePageSearch;
