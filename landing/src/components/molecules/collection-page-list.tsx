import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type CollectionPageListProps = {
  children: ReactNode;
  className?: string;
};

const CollectionPageList = ({ children, className }: CollectionPageListProps) => {
  return (
    <ul className={cn("mt-10 grid grid-cols-1 gap-7 md:grid-cols-2 md:gap-x-5 md:gap-y-16 xl:grid-cols-3", className)}>
      {children}
    </ul>
  );
};

export default CollectionPageList;
