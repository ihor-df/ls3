import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type TagProps = {
  className?: string;
  children?: ReactNode;
  as?: React.ElementType;
};

const Tag = ({ as = "div", children, className }: TagProps) => {
  const El = as;
  return <El className={cn("rounded-full bg-white/10 px-3 py-2", className)}>{children}</El>;
};

export default Tag;
