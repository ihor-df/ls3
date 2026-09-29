import { cn } from "@/lib/utils";
import PageSearch from "../molecules/page-search";
import Heading from "./heading";

type CollectionPageHeaderProps = {
  className?: string;
  title: string;
  searchValue?: string;
};

const CollectionPageHeader = ({ className, title, searchValue }: CollectionPageHeaderProps) => {
  return (
    <div className={cn("justify-between md:flex", className)}>
      <Heading variant="page">{title}</Heading>
      {searchValue !== undefined && <PageSearch className="max-md:hidden" initialValue={searchValue} />}
    </div>
  );
};

export default CollectionPageHeader;
