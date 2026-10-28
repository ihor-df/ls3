"use client";

import { useCookieConsent } from "@/context/cookie-consent-context";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";

// Ready to be placed in the site's future footer.
export default function CookieSettingsButton({
  children,
  className,
  ...props
}: Omit<ComponentProps<"button">, "onClick">) {
  const { openSettings } = useCookieConsent();
  const t = useTranslations("cookieConsent");

  return (
    <button
      {...props}
      type="button"
      className={cn("cursor-pointer disabled:cursor-default", className)}
      onClick={openSettings}
    >
      {children ?? t("settings.title")}
    </button>
  );
}
