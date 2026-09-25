import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const FilterItem = ({
  children,
  className,
  href,
  current,
  onClick,
}: {
  className?: string;
  children: ReactNode;
  href?: string;
  current?: boolean;
  onClick?: () => void;
}) => {
  return (
    <li
      className={cn(
        "leading-[1.6] font-medium tracking-[-0.01em] text-white/60 transition-colors hover:text-white hover:underline md:leading-[1.2]",
        current && "text-white underline",
        className,
      )}
    >
      {href ? (
        <Link href={href} aria-current={current ? "page" : undefined}>
          {children}
        </Link>
      ) : (
        <button
          type="button"
          aria-pressed={current}
          className={cn("cursor-pointer hover:underline", current && "underline")}
          onClick={onClick}
        >
          {children}
        </button>
      )}
    </li>
  );
};
