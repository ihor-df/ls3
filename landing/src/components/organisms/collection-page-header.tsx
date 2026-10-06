import type { SearchNavigationMode } from "@/hooks/usePageSearch";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import Heading from "../atoms/heading";
import PageSearch from "./page-search";

type CollectionPageHeaderProps = {
  className?: string;
  title: string;
  initialSearchValue?: string;
  searchNavigationMode?: SearchNavigationMode;
  searchClassName?: string;
};

const CollectionPageHeader = ({
  className,
  title,
  initialSearchValue,
  searchNavigationMode,
  searchClassName = "max-md:hidden",
}: CollectionPageHeaderProps) => {
  const hasSearch = initialSearchValue !== undefined;

  return (
    <div className={cn("w-full items-center justify-between gap-5 md:flex", className)}>
      <Heading className="max-md:text-center" variant="page">
        {title}
      </Heading>

      {hasSearch && (
        <Suspense fallback={<div className={cn("h-15 w-full md:max-w-75", searchClassName)} aria-hidden="true" />}>
          <PageSearch
            className={searchClassName}
            initialValue={initialSearchValue}
            navigationMode={searchNavigationMode}
          />
        </Suspense>
      )}
    </div>
  );
};

export default CollectionPageHeader;
