import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type ButtonProps = {
  className?: string;
  children?: ReactNode;
  size?: "base" | "large";
  variant?: "primary" | "secondary";
  disabled?: boolean;
  onClick?: () => void;
  header?: boolean;
};

const Button = ({
  children,
  className,
  size = "base",
  variant = "primary",
  disabled,
  onClick,
  header,
}: ButtonProps) => {
  return (
    <button
      className={cn(
        "flex w-full cursor-pointer items-center justify-center rounded-full border border-transparent px-16 font-bold transition-colors disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 md:w-auto",
        size === "base" && "h-16.5 md:h-18 md:text-xl",
        size === "large" && "h-22 text-xl md:h-27 md:px-15 md:text-2xl",
        variant === "primary" &&
          "bg-white text-[#1B1B1C] hover:bg-[#CED0D2] active:bg-transparent active:text-white active:max-md:border-white md:active:bg-white md:active:text-[#1B1B1C]",
        variant === "secondary" && "bg-[#222] text-white hover:bg-[#2E3134] active:bg-[#494D53]",
        header && "h-13 px-7 hover:border-white hover:bg-transparent hover:text-white md:h-13 md:text-base",
        className,
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
