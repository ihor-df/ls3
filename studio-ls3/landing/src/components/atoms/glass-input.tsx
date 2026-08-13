"use client";

import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, useState } from "react";

type GlassInputProps = Omit<ComponentPropsWithoutRef<"input">, "className" | "onChange" | "value"> & {
  className?: string;
};

const GlassInput = ({ className, onBlur, onFocus, ...props }: GlassInputProps) => {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div
      className={cn(
        "glass group flex h-12 w-full max-w-80 items-center rounded-full px-5 hover:bg-white/20!",
        focused && "bg-white/20!",
        className,
      )}
    >
      <input
        {...props}
        value={value}
        className={cn(
          "relative z-2 h-full w-full bg-transparent font-medium text-white placeholder-white/70 transition-colors outline-none group-hover:placeholder:text-white",
          focused && "placeholder:text-white",
        )}
        onChange={(e) => setValue(e.target.value)}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
      />
    </div>
  );
};

export default GlassInput;
