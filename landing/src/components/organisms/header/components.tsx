import { cn } from "@/lib/utils";

type LangSwitcherItemProps = {
  changeLocale: (locale: string) => void;
  icon: any;
  code: string;
  locale: string;
  label: string;
  className?: string;
};

export const LangSwitcherItem = ({ changeLocale, icon, code, locale, label, className }: LangSwitcherItemProps) => {
  const Icon = icon;
  return (
    <li
      className={cn(
        "rounded-full transition-colors duration-300 hover:bg-white/10",
        locale === code && "bg-white/10",
        className,
      )}
    >
      <button
        onClick={() => changeLocale(code)}
        aria-pressed={locale === code}
        className="flex w-full cursor-pointer items-center gap-4 p-3 leading-[1.1] tracking-[-0.01em]"
      >
        <span className="flex size-10 min-w-10 items-center justify-center rounded-full bg-white/10">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        {label}
      </button>
    </li>
  );
};
