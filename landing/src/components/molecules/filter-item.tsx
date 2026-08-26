import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const FilterItem = ({
  children,
  className,
  href,
  current,
}: {
  className?: string;
  children: ReactNode;
  href: string;
  current?: boolean;
}) => {
  return (
    <li
      className={cn(
        "leading-[1.6] font-medium tracking-[-0.01em] text-white/60 transition-colors hover:text-white hover:underline md:leading-[1.2]",
        current && "text-white underline",
        className,
      )}
    >
      <Link href={href}>{children}</Link>
    </li>
  );
};
