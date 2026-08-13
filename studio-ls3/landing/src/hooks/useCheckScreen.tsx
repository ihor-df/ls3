"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

export default function useCheckScreen(condition: string) {
  // example: const isMobile = useCheckScreen("(max-width: 767px)");
  const [mounted, setMounted] = useState(false);

  const result = useMediaQuery(condition, { initializeWithValue: false });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return result;
}
