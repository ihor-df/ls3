"use client";

import Button from "@/components/atoms/main-button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type LoadMoreButtonProps = {
  currentPage: number;
};

const LoadMoreButton = ({ currentPage }: LoadMoreButtonProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleLoadMore = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(currentPage + 1));

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <Button className="mt-16 md:mt-40" disabled={isPending} onClick={handleLoadMore} size="large" variant="secondary">
      Load more
    </Button>
  );
};

export default LoadMoreButton;
