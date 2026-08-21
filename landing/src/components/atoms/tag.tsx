import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type TagProps = {
  className?: string;
  children?: ReactNode;
  as?: React.ElementType;
  href?: string;
};

const Tag = ({ as = "span", children, className, href }: TagProps) => {
  const El = as;
  const styles = "py-2 px-3 rounded-full bg-white/10";

  return !href ? (
    <El className={cn(styles, className)}>{children}</El>
  ) : (
    <Link href={href} className={cn(styles, "transition-colors hover:text-white", className)}>
      {children}
    </Link>
  );
};

export default Tag;
