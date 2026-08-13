"use client";

import useCheckScreen from "@hooks/useCheckScreen";
import { useEffect, useState } from "react";

const MOBILE_USER_AGENT_REGEXP = /iPhone|iPad|iPod|Android/i;

export default function useIsMobileDevice() {
  const [mounted, setMounted] = useState(false);
  const [isMobileByUserAgent, setIsMobileByUserAgent] = useState<
    boolean | null
  >(null);
  const isMobileByScreen = useCheckScreen("(max-width: 1024px)");

  useEffect(() => {
    setMounted(true);

    if (typeof navigator === "undefined") {
      setIsMobileByUserAgent(null);
      return;
    }

    const userAgent = navigator.userAgent || "";
    setIsMobileByUserAgent(MOBILE_USER_AGENT_REGEXP.test(userAgent));
  }, []);

  if (!mounted) return null;

  if (isMobileByUserAgent !== null) {
    return isMobileByUserAgent;
  }

  return !!isMobileByScreen;
}
