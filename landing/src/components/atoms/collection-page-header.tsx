import { cn } from "@/lib/utils";
import { Suspense } from "react";
import PageSearch from "../molecules/page-search";
import Heading from "./heading";

type CollectionPageHeaderProps = {
  className?: string;
  title: string;
  searchValue?: string;
  searchNavigationMode?: "router" | "history";
};

const CollectionPageHeader = ({ className, title, searchValue, searchNavigationMode }: CollectionPageHeaderProps) => {
  return (
    <div className={cn("w-full items-center justify-between gap-5 md:flex", className)}>
      <Heading className="max-md:text-center" variant="page">
        {title}
      </Heading>
      {searchValue !== undefined && (
        <Suspense fallback={<div className="h-15 w-full max-md:hidden md:max-w-75" aria-hidden="true" />}>
          <PageSearch className="max-md:hidden" initialValue={searchValue} navigationMode={searchNavigationMode} />
        </Suspense>
      )}
    </div>
  );
};

export default CollectionPageHeader;
