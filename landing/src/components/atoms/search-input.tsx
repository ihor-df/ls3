"use client";

import { cn } from "@/lib/utils";
import Cross from "@assets/icons/cross.svg";
import { ComponentPropsWithoutRef, useState } from "react";

type SearchInputProps = Omit<ComponentPropsWithoutRef<"input">, "className" | "onChange" | "value"> & {
  className?: string;
  placeholder?: string;
};

const SearchInput = ({ className, onBlur, onFocus, placeholder = "Search", ...props }: SearchInputProps) => {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div className={cn("group relative flex h-15 w-full items-center md:max-w-75", className)}>
      <input
        {...props}
        value={value}
        placeholder={placeholder}
        className={cn(
          "relative h-full w-full rounded-full border border-transparent bg-[#222] pr-13 pl-6 font-medium placeholder-[#EAF5FF]/30 transition-colors outline-none hover:bg-[#2E2E2E] focus:border-[#313131]",
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
      <button
        type="button"
        aria-label="Reset search"
        onClick={() => setValue("")}
        className={cn(
          "absolute top-1/2 right-3.5 flex size-8 -translate-y-1/2 scale-30 cursor-pointer items-center justify-center rounded-full bg-white/10 opacity-0 transition-all duration-100",
          value && "scale-100 opacity-100",
        )}
      >
        <Cross className="size-4" />
      </button>
    </div>
  );
};

export default SearchInput;
