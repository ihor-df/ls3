"use client";

import { Link } from "@/i18n/navigation";
import { getPaginationItems, getPaginationPath } from "@/lib/pagination";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

type PagePaginationProps = {
  currentPage: number;
  pageCount: number;
  className?: string;
} & (
  | { basePath: string; onPageChange?: never; disabled?: never }
  | { basePath?: never; onPageChange: (page: number) => void; disabled?: boolean }
);

const PagePagination = ({
  currentPage,
  pageCount,
  className,
  basePath,
  onPageChange,
  disabled,
}: PagePaginationProps) => {
  const t = useTranslations("common.pagination");

  if (pageCount <= 1) return null;

  const items = getPaginationItems(currentPage, pageCount);

  const renderControl = (page: number, label: string, children: ReactNode, unavailable = false) => {
    const isCurrentPage = page === currentPage;
    const controlClassName = cn(
      "bg-input-default text-light-grey flex h-8 min-w-8 shrink-0 cursor-pointer items-center justify-center rounded-full px-2 text-sm tabular-nums transition-colors hover:bg-[#2E2E2E] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-orange disabled:pointer-events-none disabled:cursor-default disabled:opacity-35 sm:h-12 sm:min-w-12 sm:px-3 sm:text-base",
      isCurrentPage && "bg-accent-orange text-background hover:bg-accent-orange hover:text-background",
    );
    const controlProps = {
      className: controlClassName,
      "aria-label": label,
      "aria-current": isCurrentPage ? ("page" as const) : undefined,
    };

    if (basePath !== undefined && !unavailable) {
      return (
        <Link href={getPaginationPath(basePath, page)} {...controlProps}>
          {children}
        </Link>
      );
    }

    return (
      <button
        type="button"
        {...controlProps}
        disabled={disabled || unavailable}
        onClick={() => {
          if (!isCurrentPage) onPageChange?.(page);
        }}
      >
        {children}
      </button>
    );
  };

  return (
    <nav aria-label={t("label")} className={cn("flex w-full justify-center", className)}>
      <ul className="flex flex-wrap items-center justify-center gap-0.5 sm:gap-2">
        <li>
          {renderControl(
            currentPage - 1,
            t("previous"),
            <ChevronLeft aria-hidden="true" className="size-4 sm:size-5" />,
            currentPage === 1,
          )}
        </li>

        {items.map((item, index) => (
          <li key={item === "ellipsis" ? `ellipsis-${index}` : item}>
            {item === "ellipsis" ? (
              <span
                aria-hidden="true"
                className="text-light-grey flex h-8 w-2 items-center justify-center sm:h-12 sm:w-8"
              >
                …
              </span>
            ) : (
              renderControl(item, t("page", { page: item }), item)
            )}
          </li>
        ))}

        <li>
          {renderControl(
            currentPage + 1,
            t("next"),
            <ChevronRight aria-hidden="true" className="size-4 sm:size-5" />,
            currentPage === pageCount,
          )}
        </li>
      </ul>
    </nav>
  );
};

export default PagePagination;
