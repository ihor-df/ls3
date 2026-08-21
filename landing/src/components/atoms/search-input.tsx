"use client";

import { cn } from "@/lib/utils";
import Cross from "@assets/icons/cross.svg";
import { ChangeEvent, ComponentPropsWithoutRef, FormEvent, useEffect, useState } from "react";

type SearchInputProps = Omit<ComponentPropsWithoutRef<"input">, "className" | "defaultValue" | "onChange" | "value"> & {
  className?: string;
  initialValue?: string;
  onSearch?: (value: string) => void;
  placeholder?: string;
};

const SearchInput = ({
  className,
  initialValue = "",
  onSearch,
  placeholder = "Search",
  ...props
}: SearchInputProps) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch?.(value.trim());
  };

  const handleReset = () => {
    setValue("");
    onSearch?.("");
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;

    setValue(nextValue);

    if (value.trim() && !nextValue.trim()) {
      onSearch?.("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("group relative flex h-15 w-full items-center md:max-w-75", className)}>
      <input
        {...props}
        aria-label={props["aria-label"] ?? placeholder}
        value={value}
        placeholder={placeholder}
        className={cn(
          "relative h-full w-full rounded-full border border-transparent bg-[#222] pr-13 pl-6 font-medium placeholder-[#EAF5FF]/30 transition-colors outline-none hover:bg-[#2E2E2E] focus:border-[#313131]",
        )}
        onChange={handleChange}
        onKeyDown={(event) => {
          props.onKeyDown?.(event);

          if (event.defaultPrevented || event.key !== "Enter") return;

          event.preventDefault();
          onSearch?.(value.trim());
        }}
      />
      <button type="submit" className="sr-only">
        Search
      </button>
      <button
        type="button"
        aria-label="Reset search"
        onClick={handleReset}
        className={cn(
          "absolute top-1/2 right-3.5 flex size-8 -translate-y-1/2 scale-30 cursor-pointer items-center justify-center rounded-full bg-white/10 opacity-0 transition-all duration-100",
          value && "scale-100 opacity-100",
        )}
      >
        <Cross className="size-4" />
      </button>
    </form>
  );
};

export default SearchInput;
