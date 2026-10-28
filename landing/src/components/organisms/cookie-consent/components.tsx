import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type ConsentButtonProps = {
  children: string;
  onClick: () => void;
  variant?: "solid" | "outline";
  className?: string;
};

export const ConsentButton = ({ children, onClick, variant = "outline", className }: ConsentButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex h-11 w-full cursor-pointer items-center justify-center rounded-full px-6 text-sm tracking-[-0.42px] uppercase transition-colors md:h-13 md:w-auto md:text-base md:tracking-[-0.32px] lg:min-w-41",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
      variant === "solid" && "text-background bg-accent-orange hover:bg-accent-orange/90",
      variant === "outline" && "border-2 border-white bg-transparent text-white hover:bg-white/10",
      className,
    )}
  >
    {children}
  </button>
);

export const CategoryCard = ({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}) => (
  <li
    className={cn(
      "flex min-h-28 items-center gap-5 rounded border-t border-white/20 bg-white/5 px-3 py-5 md:justify-between lg:px-5",
      className,
    )}
  >
    <div className="max-w-2xl">
      <h3 className="uppercase">{title}</h3>

      <p className="mt-5 text-sm leading-tight text-white/90 md:text-base lg:max-w-120">{description}</p>
    </div>
    {children}
  </li>
);

export const Toggle = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={cn(
      "relative h-10 w-18 shrink-0 cursor-pointer rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
      checked ? "bg-accent-orange" : "bg-white/30",
    )}
  >
    <span
      className={cn(
        "absolute top-1 left-1 aspect-square h-[calc(100%-8px)] rounded-full bg-white shadow-sm transition-transform",
        checked && "bg-background translate-x-full",
      )}
    />
  </button>
);
