"use client";

import { cn } from "@/lib/utils";
import Cross from "@assets/icons/cross.svg";
import { useTranslations } from "next-intl";
import { ComponentPropsWithoutRef, FormEvent, useEffect, useState } from "react";

type SearchInputProps = Omit<ComponentPropsWithoutRef<"input">, "className" | "defaultValue" | "onChange" | "value"> & {
  className?: string;
  initialValue?: string;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
};

const SearchInput = ({ className, initialValue = "", onSearch, onClear, placeholder, ...props }: SearchInputProps) => {
  const t = useTranslations("common.search");
  const searchPlaceholder = placeholder ?? t("placeholder");
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const search = value.trim();
    setValue(search);
    onSearch?.(search);
  };

  const handleReset = () => {
    setValue("");
    onSearch?.("");
  };

  return (
    <form onSubmit={handleSubmit} className={cn("group relative flex h-15 w-full items-center md:max-w-75", className)}>
      <input
        {...props}
        aria-label={props["aria-label"] ?? searchPlaceholder}
        value={value}
        placeholder={searchPlaceholder}
        className={cn(
          "bg-input-default relative h-full w-full rounded-full border border-transparent pr-13 pl-6 font-medium placeholder-[#EAF5FF]/30 transition-colors outline-none hover:bg-[#2E2E2E] focus:border-[#313131]",
        )}
        onChange={(event) => {
          const nextValue = event.target.value;
          setValue(nextValue);
          if (!nextValue.trim()) onClear?.();
        }}
      />
      <button type="submit" className="sr-only">
        {t("submit")}
      </button>

      <button
        type="button"
        aria-label={t("reset")}
        disabled={!value}
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
