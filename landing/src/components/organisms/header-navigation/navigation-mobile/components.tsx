import ButtonRounded from "@/components/atoms/button-rounded";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import Arrow from "@assets/icons/arrow.svg";
import Cross from "@assets/icons/cross.svg";
import { ComponentProps } from "react";
import { MobileMenuCategory } from "../types";

type FirstLevelMenuItemProps = ComponentProps<"li"> & {
  label: string;
  handleClick: (menuItem: MobileMenuCategory) => void;
  menuName: MobileMenuCategory;
  relativeTo: string;
  activeMenu: MobileMenuCategory | undefined;
};

export const FirstLevelMenuItem = ({
  label,
  className,
  handleClick,
  menuName,
  relativeTo,
  activeMenu,
  ...props
}: FirstLevelMenuItemProps) => {
  const isActive = activeMenu === menuName;

  return (
    <li {...props} className={className}>
      <button
        type="button"
        onClick={() => handleClick(menuName)}
        className="flex w-full items-center justify-between text-start text-2xl leading-[1.2] font-bold"
        aria-expanded={isActive}
        aria-controls={relativeTo}
      >
        {label}
        <Arrow aria-hidden="true" className="size-4 -rotate-90" />
      </button>
    </li>
  );
};

type MenuListItemProps = ComponentProps<"li"> & {
  activeMenu: MobileMenuCategory;
  menuName: MobileMenuCategory;
  relativeTo: string;
  label?: string;
};

export const MenuListItem = ({ activeMenu, menuName, relativeTo, label, children, ...props }: MenuListItemProps) => {
  return (
    <li
      {...props}
      inert={activeMenu !== menuName}
      className={cn(
        "custom-scrollbar absolute inset-0 -translate-x-full overflow-y-auto px-7 pb-20 transition-transform duration-300",
        activeMenu === menuName && "translate-x-0",
      )}
    >
      {label && <h2 className="font-bold tracking-[-0.01em] text-white/60">{label}</h2>}
      <ul id={relativeTo} className="mt-5 flex flex-col gap-4">
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
    <li {...props} className={cn("pr-2.5 transition-colors duration-300 hover:bg-white/10", className)}>
      <Link
        className="flex h-full items-center gap-4 text-xl leading-[1.1] font-bold tracking-[-0.01em]"
        href={href}
        aria-current={active ? "location" : undefined}
      >
        <span
          className={cn(
            "flex size-10 min-w-10 items-center justify-center rounded-lg bg-white/10 transition-all duration-100",
            active && "bg-accent-orange",
          )}
        >
          <Icon aria-hidden="true" className="size-5" />
        </span>
        {label}
      </Link>
    </li>
  );
};

export const CloseButton = ({ ariaLabel, onClick }: { ariaLabel: string; onClick: () => void }) => {
  return (
    <ButtonRounded
      className="size-12 uppercase"
      buttonProps={{
        "aria-label": ariaLabel,
        onClick: onClick,
      }}
    >
      <Cross aria-hidden="true" className="size-5" />
    </ButtonRounded>
  );
};
