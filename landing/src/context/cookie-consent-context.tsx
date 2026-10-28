"use client";

import { trackEvent, updateGoogleConsent } from "@/lib/analytics";
import { requiresCookieConsentBanner } from "@/lib/cookie-consent/regions";
import { readStoredCookieConsent, writeStoredCookieConsent } from "@/lib/cookie-consent/storage";
import {
  ALL_COOKIE_PREFERENCES,
  ESSENTIAL_COOKIE_PREFERENCES,
  type CookieConsentCategory,
  type CookieConsentPreferences,
  type StoredCookieConsent,
} from "@/lib/cookie-consent/types";
import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

const CookieConsentModal = dynamic(() => import("@/components/organisms/cookie-consent"), { ssr: false });

type CookieConsentContextType = {
  hasConsent: (category: CookieConsentCategory) => boolean;
  openSettings: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  // Undefined means loading; null means the visitor has not made a choice.
  const [consent, setConsent] = useState<StoredCookieConsent | null>();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const hasDecided = useRef(false);

  const savePreferences = useCallback((preferences: CookieConsentPreferences) => {
    const stored = writeStoredCookieConsent(preferences);
    hasDecided.current = true;
    const googleConsent = updateGoogleConsent(stored.preferences);
    trackEvent("cookie_consent_update", googleConsent);
    setConsent(stored);
    setSettingsOpen(false);
  }, []);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const stored = readStoredCookieConsent();

    if (stored) {
      hasDecided.current = true;
      setConsent(stored);
      updateGoogleConsent(stored.preferences);
      return;
    }

    // A slow/failed lookup must not leave visitors without a way to make a choice.
    const timeout = window.setTimeout(() => controller.abort(), 5000);

    void fetch("/api/geo", { cache: "no-store", signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((geo) => {
        // A late lookup must not replace a choice made in the meantime.
        if (!active || hasDecided.current) return;
        if (requiresCookieConsentBanner(geo?.country?.code)) setConsent(null);
        else savePreferences(ALL_COOKIE_PREFERENCES);
      })
      .catch(() => {
        if (active) setConsent((current) => current ?? null);
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      active = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [savePreferences]);

  return (
    <CookieConsentContext
      value={{
        hasConsent: (category) => category === "essential" || consent?.preferences[category] === true,
        openSettings: () => setSettingsOpen(true),
      }}
    >
      {children}
      {(consent === null || settingsOpen) && (
        <CookieConsentModal
          key={consent?.decidedAt ?? (settingsOpen ? "settings" : "notice")}
          initialView={settingsOpen ? "settings" : "notice"}
          preferences={consent?.preferences ?? ALL_COOKIE_PREFERENCES}
          hasAnswered={Boolean(consent)}
          acceptAll={() => savePreferences(ALL_COOKIE_PREFERENCES)}
          rejectAll={() => savePreferences(ESSENTIAL_COOKIE_PREFERENCES)}
          onSavePreferences={savePreferences}
          onCloseSettings={() => setSettingsOpen(false)}
        />
      )}
    </CookieConsentContext>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) throw new Error("useCookieConsent must be used within a CookieConsentProvider");
  return context;
}
