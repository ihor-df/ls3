import { cn } from "@/lib/utils";
import PageSearch from "../molecules/page-search";
import Heading from "./heading";

type CollectionPageHeaderProps = {
  className?: string;
  title: string;
  initSearchValue?: string;
};

const CollectionPageHeader = ({ className, title, initSearchValue }: CollectionPageHeaderProps) => {
  return (
    <div className={cn("justify-between md:flex", className)}>
      <Heading variant="page">{title}</Heading>
      {initSearchValue && <PageSearch className="max-md:hidden" initialValue={initSearchValue} />}
    </div>
  );
};

export default CollectionPageHeader;
