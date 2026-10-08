import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import type { Locale } from "next-intl";
import { routing } from "../i18n/routing.ts";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

export const imageBuilder = (source: SanityImageSource) =>
  projectId && dataset ? createImageUrlBuilder({ projectId, dataset }).image(source) : null;

export type LocaleHrefs = Partial<Record<Locale, string>>;
export type LanguageNavigation = Record<string, LocaleHrefs>;

export function getLocaleHrefs(pathname: string, navigation: LanguageNavigation): LocaleHrefs {
  if (pathname.includes("privacy") || pathname.includes("license")) return { en: pathname };

  if (navigation[pathname]) return navigation[pathname];
  if (["/blog", "/partners"].some((section) => pathname === section || pathname.startsWith(`${section}/`))) return {};

  return Object.fromEntries(routing.locales.map((locale) => [locale, pathname]));
}
