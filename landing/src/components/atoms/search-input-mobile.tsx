"use client";

import { cn } from "@/lib/utils";
import SearchIcon from "@assets/icons/search.svg";
import { useTranslations } from "next-intl";
import { ComponentPropsWithoutRef, FormEvent, useEffect, useState } from "react";

type SearchInputMobileProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "className" | "defaultValue" | "onChange" | "value"
> & {
  className?: string;
  initialValue?: string;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  isOpen: boolean;
  handleOpen: (value: boolean) => void;
};

const SearchInputMobile = ({
  className,
  initialValue = "",
  onSearch,
  onClear,
  placeholder,
  isOpen,
  handleOpen,
  onFocus,
  ...props
}: SearchInputMobileProps) => {
  const t = useTranslations("common.search");
  const searchPlaceholder = placeholder ?? t("placeholder");
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue, isOpen]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const search = value.trim();
    setValue(search);
    onSearch?.(search);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "group relative flex h-12 min-w-0 flex-1 items-center overflow-hidden rounded-full bg-white/10",
        className,
      )}
    >
      <SearchIcon aria-hidden="true" className="pointer-events-none absolute top-3.5 left-3.5 size-5" />
      <input
        {...props}
        aria-label={props["aria-label"] ?? searchPlaceholder}
        value={value}
        placeholder={isOpen ? searchPlaceholder : undefined}
        onFocus={(e) => {
          handleOpen(true);
          onFocus?.(e);
        }}
        className={cn(
          "relative h-full min-w-0 flex-1 pr-4 pl-10.5 font-medium placeholder-[#EAF5FF]/30 transition-opacity duration-200 outline-none",
          !isOpen && "opacity-0",
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
    </form>
  );
};

export default SearchInputMobile;
