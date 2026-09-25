import { cn } from "@/lib/utils";
import PageSearch from "../molecules/page-search";
import Heading from "./heading";

type CollectionPageHeaderProps = {
  className?: string;
  title: string;
  initialSearchValue?: string;
};

const CollectionPageHeader = ({ className, title, initialSearchValue }: CollectionPageHeaderProps) => {
  return (
    <div className={cn("justify-between md:flex", className)}>
      <Heading variant="page">{title}</Heading>
      {initialSearchValue && <PageSearch className="max-md:hidden" initialValue={initialSearchValue} />}
    </div>
  );
};

export default CollectionPageHeader;
