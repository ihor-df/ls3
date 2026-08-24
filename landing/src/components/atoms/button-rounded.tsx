"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonRoundedProps = {
  className?: string;
  children?: ReactNode;
  buttonProps?: ComponentPropsWithoutRef<"button">;
  linkProps?: ComponentPropsWithoutRef<"a">;
  href?: string;
  name?: string;
};

export const buttonRoundedStyles =
  "bg-white/10 hover:bg-white/20 active:bg-white/30 size-13 flex cursor-pointer items-center justify-center rounded-full transition-colors";

const ButtonRounded = ({ className, children, buttonProps, linkProps, href, name }: ButtonRoundedProps) => {
  return href ? (
    <Link
      href={name === "email" ? `mailto:${href}` : href}
      rel="noopener noreferrer"
      {...linkProps}
      className={cn(buttonRoundedStyles, className)}
    >
      {children}
    </Link>
  ) : (
    <button type="button" {...buttonProps} className={cn(buttonRoundedStyles, className)}>
      {children}
    </button>
  );
};

export default ButtonRounded;
