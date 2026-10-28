export type CookieConsentCategory = "essential" | "functional" | "analytics" | "advertising";
export type OptionalCookieCategory = Exclude<CookieConsentCategory, "essential">;

export type CookieConsentPreferences = Record<CookieConsentCategory, boolean>;

export type StoredCookieConsent = {
  decidedAt: string;
  preferences: CookieConsentPreferences;
};

export const ALL_COOKIE_PREFERENCES: CookieConsentPreferences = {
  essential: true,
  functional: true,
  analytics: true,
  advertising: true,
};

export const ESSENTIAL_COOKIE_PREFERENCES: CookieConsentPreferences = {
  essential: true,
  functional: false,
  analytics: false,
  advertising: false,
};
