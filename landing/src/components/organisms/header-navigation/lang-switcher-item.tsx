import { getPathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Locale } from "next-intl";

type LangSwitcherItemProps = {
  href?: string;
  onClick?: () => void;
  icon: any;
  code: Locale;
  locale: Locale;
  label: string;
  className?: string;
};

export const LangSwitcherItem = ({ href, onClick, icon, code, locale, label, className }: LangSwitcherItemProps) => {
  const Icon = icon;
  const itemClassName = "flex w-full items-center gap-4 p-3 leading-[1.1] tracking-[-0.01em]";
  const content = (
    <>
      <span className="flex size-10 min-w-10 items-center justify-center rounded-full bg-white/10">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      {label}
    </>
  );
  return (
    <li
      className={cn(
        "rounded-full transition-colors duration-300",
        href && "hover:bg-white/10",
        locale === code && "bg-white/10",
        className,
      )}
    >
      {href ? (
        <a
          // The prefix updates the locale cookie before redirecting back to an unprefixed English URL.
          href={getPathname({ href, locale: code, forcePrefix: code !== locale || undefined })}
          hrefLang={code}
          onClick={onClick}
          aria-current={locale === code ? "page" : undefined}
          className={cn(itemClassName, "cursor-pointer")}
        >
          {content}
        </a>
      ) : (
        <span aria-disabled="true" className={cn(itemClassName, "cursor-default opacity-50")}>
          {content}
        </span>
      )}
    </li>
  );
};
