import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const FilterItem = ({
  children,
  className,
  href,
}: {
  className?: string;
  children: ReactNode;
  href: string;
}) => {
  return (
    <li
      className={cn(
        "leading-[1.2] font-medium tracking-[-0.01em] text-white/60 transition-colors hover:text-white hover:underline",
        className,
      )}
    >
      <Link href={href}>{children}</Link>
    </li>
  );
};
