"use client";

import SearchInput from "@/components/atoms/search-input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type BlogSearchProps = {
  className?: string;
  initialValue?: string;
};

const BlogSearch = ({ className, initialValue = "" }: BlogSearchProps) => {
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
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return <SearchInput className={className} initialValue={initialValue} onSearch={handleSearch} />;
};

export default BlogSearch;
