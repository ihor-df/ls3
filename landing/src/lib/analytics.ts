import type { CookieConsentPreferences } from "./cookie-consent/types";
import { isProductionDomain } from "./utils";

export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;
export type GoogleConsentState = {
  analytics_storage: "granted" | "denied";
  ad_storage: "granted" | "denied";
  ad_user_data: "granted" | "denied";
  ad_personalization: "granted" | "denied";
};

declare global {
  interface Window {
    dataLayer?: Array<(AnalyticsPayload & { event: string }) | IArguments>;
    gtag?: (...args: unknown[]) => void;
  }
}

export const getGoogleConsentState = (preferences: CookieConsentPreferences): GoogleConsentState => {
  const advertising = preferences.advertising ? "granted" : "denied";
  return {
    analytics_storage: preferences.analytics ? "granted" : "denied",
    ad_storage: advertising,
    ad_user_data: advertising,
    ad_personalization: advertising,
  };
};

export const updateGoogleConsent = (preferences: CookieConsentPreferences) => {
  const state = getGoogleConsentState(preferences);
  if (isProductionDomain()) window.gtag?.("consent", "update", state);
  clearDeniedGoogleCookies(preferences);
  return state;
};

export const trackEvent = (event: string, payload: AnalyticsPayload = {}) => {
  if (!isProductionDomain()) return;
  window.dataLayer?.push({ ...payload, event });
};

const clearDeniedGoogleCookies = (preferences: CookieConsentPreferences) => {
  if (preferences.analytics && preferences.advertising) return;

  const domains = window.location.hostname
    .split(".")
    .map((_, index, parts) => parts.slice(index).join("."))
    .slice(0, -1);

  for (const cookie of document.cookie.split(";")) {
    const name = cookie.trim().split("=")[0];
    const analyticsCookie = /^_(?:ga(?:_|$)|gid$|gat(?:_|$)|dc_gtm_)/.test(name);
    const advertisingCookie = /^_(?:gcl_|gac_)/.test(name);
    if ((preferences.analytics || !analyticsCookie) && (preferences.advertising || !advertisingCookie)) continue;

    document.cookie = `${name}=; Max-Age=0; Path=/`;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${domain}`;
    }
  }
};
