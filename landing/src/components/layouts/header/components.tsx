import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import Arrow from "@assets/icons/arrow.svg";
import { ComponentProps } from "react";
import { MenuCategory } from "./index.tsx";

type FirstLevelMenuItemProps = ComponentProps<"li"> & {
  label: string;
  handleClick: (menuItem: MenuCategory) => void;
  menuName: MenuCategory;
  relativeTo: string;
  activeMenu: MenuCategory | undefined;
};

export const FirstLevelMenuItem = ({
  label,
  className,
  handleClick,
  menuName,
  relativeTo,
  activeMenu,
}: FirstLevelMenuItemProps) => {
  const isActive = activeMenu === menuName;

  return (
    <li className={cn(className)}>
      <button
        type="button"
        className="flex cursor-pointer items-center gap-1.5 underline decoration-transparent transition-colors hover:decoration-white"
        aria-expanded={isActive}
        aria-controls={relativeTo}
        onClick={() => handleClick(menuName)}
      >
        {label}
        <Arrow className={cn("h-auto w-3 transition-transform", isActive && "rotate-180")} />
      </button>
    </li>
  );
};

type SecondLevelMenuItemProps = ComponentProps<"li"> & {
  label: string;
  icon: any;
  href: string;
  active?: boolean;
};

export const SecondLevelMenuItem = ({ href, icon, label, className, active }: SecondLevelMenuItemProps) => {
  const Icon = icon;

  return (
    <li
      className={cn(
        "rounded-small transition-colors duration-300 hover:bg-white/10",
        active && "bg-white/10",
        className,
      )}
    >
      <Link className="flex max-w-52 items-center gap-4 p-3 leading-[1.1] tracking-[-0.01em]" href={href}>
        <span
          className={cn(
            "flex size-10 min-w-10 items-center justify-center rounded-lg bg-white/10 transition-all duration-100",
          )}
        >
          <Icon className="size-5" />
        </span>
        {label}
      </Link>
    </li>
  );
};
