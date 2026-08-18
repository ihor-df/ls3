import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Fragment } from "react/jsx-runtime";

export type BreadcrumbItemData = {
  label: string | null;
  href?: string;
};

type BreadcrumbsProps = {
  pathname?: string;
  items?: BreadcrumbItemData[];
};

export function Breadcrumbs({ pathname, items }: BreadcrumbsProps) {
  const crumbs: BreadcrumbItemData[] =
    items && items.length
      ? items
      : (pathname ?? "")
          .split("/")
          .filter(Boolean)
          .map((step, i, steps) => ({
            label: step.split("-").join(" "),
            href: "/" + steps.slice(0, i + 1).join("/"),
          }));

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;

          return (
            <Fragment key={`${crumb.href ?? "current"}-${crumb.label}-${i}`}>
              <BreadcrumbItem className={cn("tracking-[-0.01em]", isLast && "min-w-0 text-white/60")}>
                {isLast || !crumb.href ? (
                  <p className="truncate">{crumb.label}</p>
                ) : (
                  <Link href={crumb.href}>{crumb.label}</Link>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
