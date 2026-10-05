"use client";

import SearchInput from "@/components/atoms/search-input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type PageSearchProps = {
  className?: string;
  initialValue?: string;
  navigationMode?: "router" | "history";
};

const PageSearch = ({ className, initialValue = "", navigationMode = "router" }: PageSearchProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const search = value.trim();

    if (search) {
      params.set("q", search);
    } else {
      params.delete("q");
    }

    params.delete("page");

    const query = params.toString();
    const href = query ? `${pathname}?${query}` : pathname;

    if (navigationMode === "history") {
      window.history.pushState(null, "", href);
      return;
    }

    router.push(href);
  };

  return (
    <SearchInput className={className} initialValue={searchParams.get("q") ?? initialValue} onSearch={handleSearch} />
  );
};

export default PageSearch;
