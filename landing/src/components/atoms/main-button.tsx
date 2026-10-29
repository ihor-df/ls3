"use client";

import { cn } from "@/lib/utils";
import type { PointerEvent, ReactNode } from "react";

import styles from "../../styles/main-button.module.css";

type ButtonProps = {
  className?: string;
  children?: ReactNode;
  size?: "small" | "base" | "large";
  variant?: "primary" | "secondary";
  animated?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

// todo: Add Link
const Button = ({
  children,
  className,
  size = "base",
  variant = "primary",
  animated = true,
  disabled,
  onClick,
}: ButtonProps) => {
  const isAnimated = variant === "primary" && animated;

  const updateHighlight = (event: PointerEvent<HTMLButtonElement>) => {
    if (disabled || event.pointerType === "touch" || !isAnimated) return;

    const button = event.currentTarget;
    const { left, top, width, height } = button.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((event.clientX - left) / width) * 100));
    const y = Math.min(100, Math.max(0, ((event.clientY - top) / height) * 100));

    // Both gradient layers use the same position, without a React render on every move.
    button.style.setProperty("--pointer-x", `${x}%`);
    button.style.setProperty("--pointer-y", `${y}%`);
  };

  return (
    <button
      className={cn(
        "flex w-full cursor-pointer items-center justify-center rounded-full border border-transparent px-16 font-bold text-nowrap transition-colors disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 md:w-auto",
        isAnimated && styles.primary,
        variant === "primary" &&
          "bg-white text-[#1B1B1C] active:bg-transparent active:text-white active:max-md:border-white md:active:bg-white md:active:text-[#1B1B1C]",
        variant === "primary" && !animated && "hover:bg-[#CED0D2]",
        variant === "secondary" && "bg-input-default text-white hover:bg-[#2E3134] active:bg-[#494D53]",
        size === "small" && variant === "primary" && "h-13 px-7 md:h-13 md:text-base",
        size === "small" &&
          variant === "primary" &&
          !animated &&
          "hover:border-white hover:bg-transparent hover:text-white",
        size === "small" && variant === "secondary" && "h-13 px-7 md:h-13 md:text-base",
        size === "base" && "h-16.5 md:h-18 md:text-xl",
        size === "large" && "h-22 text-xl md:h-27 md:px-15 md:text-2xl",
        className,
      )}
      disabled={disabled}
      onClick={onClick}
      onPointerEnter={isAnimated ? updateHighlight : undefined}
      onPointerMove={isAnimated ? updateHighlight : undefined}
    >
      {children}
    </button>
  );
};

export default Button;
