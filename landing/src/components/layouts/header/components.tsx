import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import Arrow from "@assets/icons/arrow.svg";
import { ComponentProps } from "react";
import type { MenuCategory } from "./index";

type FirstLevelMenuItemProps = ComponentProps<"li"> & {
  label: string;
  handleClick: (menuItem: MenuCategory) => void;
  handleMouseEnter: (menuItem: MenuCategory) => void;
  menuName: MenuCategory;
  relativeTo: string;
  activeMenu: MenuCategory | undefined;
};

export const FirstLevelMenuItem = ({
  label,
  className,
  handleClick,
  handleMouseEnter,
  menuName,
  relativeTo,
  activeMenu,
  ...props
}: FirstLevelMenuItemProps) => {
  const isActive = activeMenu === menuName;

  return (
    <li {...props} className={cn(className)} onMouseEnter={() => handleMouseEnter(menuName)}>
      <button
        type="button"
        className="flex cursor-pointer items-center gap-1.5 underline decoration-transparent transition-colors hover:decoration-white"
        aria-expanded={isActive}
        aria-controls={relativeTo}
        onClick={() => handleClick(menuName)}
      >
        {label}
        <Arrow className={cn("h-auto w-3 transition-[rotate]", isActive && "rotate-180")} />
      </button>
    </li>
  );
};

type SecondLevelMenuProps = ComponentProps<"li"> & {
  activeMenu: MenuCategory | undefined;
  renderedMenu: MenuCategory | undefined;
  menuName: MenuCategory;
  relativeTo: string;
};

export const SecondLevelMenu = ({
  activeMenu,
  children,
  relativeTo,
  menuName,
  renderedMenu,
  ...props
}: SecondLevelMenuProps) => {
  return (
    <li {...props} className={cn("grid", renderedMenu === menuName ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
      <ul
        className="grid min-h-0 grid-cols-3 gap-x-10 gap-y-1 overflow-hidden"
        id={relativeTo}
        aria-hidden={activeMenu !== menuName}
        inert={activeMenu !== menuName}
      >
        {children}
      </ul>
    </li>
  );
};

type SecondLevelMenuItemProps = ComponentProps<"li"> & {
  label: string;
  icon: any;
  href: string;
  active?: boolean;
};

export const SecondLevelMenuItem = ({ href, icon, label, className, active, ...props }: SecondLevelMenuItemProps) => {
  const Icon = icon;

  return (
    <li
      {...props}
      className={cn(
        "rounded-small transition-colors duration-300 hover:bg-white/10",
        active && "bg-white/10",
        className,
      )}
    >
      <Link
        className="flex h-full max-w-54 items-center gap-4 p-3 leading-[1.1] tracking-[-0.01em]"
        href={href}
        aria-current={active ? "location" : undefined}
      >
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
