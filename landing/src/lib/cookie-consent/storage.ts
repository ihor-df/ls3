"use client";

import type { CookieConsentPreferences, StoredCookieConsent } from "./types";

// Increment when the cookie policy changes to request a new decision.
const COOKIE_CONSENT_NAME = "ls_cookie_consent_v1";
const COOKIE_CONSENT_MAX_AGE = 60 * 60 * 24 * 180;

const normalizeCookieConsentPreferences = (preferences: CookieConsentPreferences): CookieConsentPreferences => ({
  essential: true,
  functional: preferences.functional === true,
  analytics: preferences.analytics === true,
  advertising: preferences.advertising === true,
});

export const readStoredCookieConsent = (): StoredCookieConsent | null => {
  const raw = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${COOKIE_CONSENT_NAME}=`))
    ?.slice(COOKIE_CONSENT_NAME.length + 1);

  if (!raw) return null;

  try {
    const { decidedAt, preferences } = JSON.parse(decodeURIComponent(raw)) as StoredCookieConsent;
    return {
      decidedAt,
      preferences: normalizeCookieConsentPreferences(preferences),
    };
  } catch {
    return null;
  }
};

export const writeStoredCookieConsent = (preferences: CookieConsentPreferences): StoredCookieConsent => {
  const consent: StoredCookieConsent = {
    decidedAt: new Date().toISOString(),
    preferences: normalizeCookieConsentPreferences(preferences),
  };

  document.cookie = `${COOKIE_CONSENT_NAME}=${encodeURIComponent(JSON.stringify(consent))}; Max-Age=${COOKIE_CONSENT_MAX_AGE}; Path=/; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
  return consent;
};
