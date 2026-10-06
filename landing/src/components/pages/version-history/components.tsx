import { cn } from "@/lib/utils";
import ArrowIcon from "@assets/icons/arrow.svg";
import CirclesIcon from "@assets/icons/circles.svg";
import { ComponentProps } from "react";
import type { SelectedPeriod } from "./types";

export const Circles = ({ className, size = "sm" }: { className?: string; size?: "sm" | "lg" }) => {
  return (
    <div
      className={cn(
        "flex size-9 items-center justify-center rounded-full bg-white/10",
        size === "lg" && "size-12",
        className,
      )}
    >
      <CirclesIcon className={cn("size-6", size === "lg" && "size-8")} />
    </div>
  );
};

export const MonthButtonDesktop = ({
  month,
  label,
  amount,
  year,
  selected,
  ...props
}: ComponentProps<"button"> & {
  month: number;
  label: string;
  amount: number;
  year: number;
  selected: SelectedPeriod | null;
}) => {
  const active = selected?.month === month && selected.year === year;

  return (
    <button
      {...props}
      className={cn(
        "hover:bg-sidebar-hover flex w-full cursor-pointer items-center justify-between rounded-full px-5 py-4 transition-colors",
        active && "bg-sidebar-hover",
      )}
      type="button"
      aria-pressed={active}
    >
      <span className={cn("text-xl font-bold text-white/60", active && "text-white")}>{label}</span>{" "}
      <span className="tracking-[-0.01em] text-[#EAF5FF]/30">{amount}</span>
    </button>
  );
};

export const SelectYearButton = ({
  className,
  year,
  quantity,
  isOpen,
  variant = "desktop",
  selectedDate,
  iconSize,
  arrowClassName,
  ...props
}: ComponentProps<"button"> & {
  year: number;
  quantity?: number;
  isOpen?: boolean;
  variant?: "mobile" | "desktop";
  selectedDate: SelectedPeriod | null;
  iconSize?: "sm" | "lg";
  arrowClassName?: string;
}) => {
  const active = selectedDate?.month === null && selectedDate.year === year;

  return (
    <button
      type="button"
      {...props}
      className={cn(
        "flex w-full cursor-pointer items-center rounded-full py-4 pr-1 transition-colors",
        variant === "desktop" && "hover:bg-sidebar-hover px-5",
        active && variant === "desktop" && "bg-sidebar-hover",
        className,
      )}
      aria-pressed={active}
    >
      <Circles size={iconSize} />
      <span className="ml-4 text-xl lg:text-2xl">{year}</span>
      <span className="ml-auto flex gap-7">
        {quantity && <span className="tracking-[-0.01em] text-[#EAF5FF]/30">{quantity}</span>}
        {variant === "mobile" && (
          <ArrowIcon className={cn("size-4 transition-transform", isOpen && "rotate-180", arrowClassName)} />
        )}
      </span>
    </button>
  );
};

export const MonthButtonMobile = ({
  className,
  active,
  children,
  ...props
}: ComponentProps<"button"> & { active: boolean }) => {
  return (
    <button
      {...props}
      className={cn(
        "bg-sidebar-hover w-full rounded-2xl border-2 border-transparent leading-none font-bold tracking-[-0.01em] md:w-32",
        active && "border-white",
        className,
      )}
      aria-pressed={active}
      type="button"
    >
      {children}
    </button>
  );
};
