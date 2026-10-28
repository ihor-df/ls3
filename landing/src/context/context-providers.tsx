"use client";

import BlogSearchProvider from "@/context/blog-search-provider";
import { CookieConsentProvider, useCookieConsent } from "@/context/cookie-consent-context";
import PartnersSearchProvider from "@/context/partners-search-provider";
import { usePathname } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { useLocale } from "next-intl";
import { useEffect, type ReactNode } from "react";

type ContextProvidersProps = {
  children: ReactNode;
  crispWebsiteId?: string;
};

// Keeps consent-dependent services together, inside CookieConsentProvider.
function ConsentServices({ crispWebsiteId }: Omit<ContextProvidersProps, "children">) {
  const { hasConsent } = useCookieConsent();

  const analyticsAllowed = hasConsent("analytics");
  const functionalAllowed = hasConsent("functional");
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    // Send the current page when analytics is allowed, and again after navigation.
    if (!analyticsAllowed) return;

    // Keep query parameters and form values out of analytics.
    trackEvent("page_view", {
      route: pathname,
      locale,
      page_type: pathname.split("/").filter(Boolean)[0]?.replaceAll("-", "_") || "home",
      page_location: `${window.location.origin}${window.location.pathname}`,
      page_title: document.title,
    });
  }, [analyticsAllowed, locale, pathname]);

  useEffect(() => {
    if (!crispWebsiteId || !functionalAllowed) return;

    let active = true;
    let crisp: typeof import("crisp-sdk-web").Crisp | undefined;
    // Download the SDK only after consent. Ignore it if consent changes while it loads.
    void import("crisp-sdk-web")
      .then(({ Crisp }) => {
        if (!active) return;
        crisp = Crisp;
        crisp.configure(crispWebsiteId);
        crisp.chat.show();
      })
      .catch((error) => console.error("Could not load the support chat", error));

    return () => {
      active = false;
      crisp?.chat.close();
      crisp?.session.reset();
      crisp?.chat.hide();
    };
  }, [crispWebsiteId, functionalAllowed]);

  // Crisp may recreate its launcher after a session reset, so keep its root hidden while denied.
  return crispWebsiteId && !functionalAllowed ? (
    <style data-cookie-consent-crisp>{".crisp-client { display: none !important; }"}</style>
  ) : null;
}

const ContextProviders = ({ children, crispWebsiteId }: ContextProvidersProps) => {
  return (
    <CookieConsentProvider>
      <BlogSearchProvider>
        <PartnersSearchProvider>{children}</PartnersSearchProvider>
      </BlogSearchProvider>

      <ConsentServices crispWebsiteId={crispWebsiteId} />
    </CookieConsentProvider>
  );
};

export default ContextProviders;
