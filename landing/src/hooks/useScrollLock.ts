"use client";

import { useEffect } from "react";

// disable scroll by condition
export default function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    const root = document.documentElement;
    const body = document.body;
    const rootOverflow = root.style.overflow;
    const bodyOverflow = body.style.overflow;

    root.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      root.style.overflow = rootOverflow;
      body.style.overflow = bodyOverflow;
    };
  }, [isLocked]);
}
