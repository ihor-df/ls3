import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type SecondLevelMenuItemProps = ComponentProps<"li"> & {
  label: string;
  href: string;
  icon: any;
  active?: boolean;
};

const SecondLevelMenuItem = ({ href, icon, label, className, active }: SecondLevelMenuItemProps) => {
  const Icon = icon;

  return (
    <li
      className={cn(
        "group rounded-full transition-colors duration-300 hover:bg-white/10",
        active && "bg-white/10",
        className,
      )}
    >
      <Link className="flex max-w-52 items-center gap-4 p-3 leading-[1.1] tracking-[-0.01em]" href={href}>
        <span
          className={cn(
            "flex size-10 min-w-10 items-center justify-center rounded-lg bg-white/10 transition-all duration-100 group-hover:rounded-full",
            active && "rounded-full",
          )}
        >
          <Icon className="size-5" />
        </span>
        {label}
      </Link>
    </li>
  );
};

export default SecondLevelMenuItem;
