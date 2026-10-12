import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { clsx, type ClassValue } from "clsx";
import { Locale } from "next-intl";
import { twMerge } from "tailwind-merge";
import { PRODUCTION_DOMAIN } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: string,
  locale: string,
  options?: {
    month?: "2-digit" | "numeric" | "long" | "short" | "narrow";
  },
) {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: options?.month ?? "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export const appDomain = () => PRODUCTION_DOMAIN; // TODO: process.env.NEXT_PUBLIC_APP_DOMAIN
export const isProductionDomain = () => process.env.NEXT_PUBLIC_APP_DOMAIN === "ls.app"; // TODO: appDomain() === "ls.app";

export const hostName = () => {
  const protocol = process.env.APP_DOMAIN === "localhost:3000" ? "http" : "https";
  return `${protocol}://${process.env.APP_DOMAIN || PRODUCTION_DOMAIN}`;
};

// Remove trailing slashes from every path except the site root (/).
export const normalizePathname = (pathname: string) => {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "");
};

export const generateUrl = (locale: Locale, pathname: string) => {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  // Use routing's locale prefixes: en → none, uk → /ua, zh → /ch, others → /{locale}.
  const localizedPathname = getPathname({ locale, href: path });

  return `${hostName()}${normalizePathname(localizedPathname)}`;
};

export async function generatePageMetadata({
  locale,
  pathname,
  title,
  description,
  pageLocales,
}: {
  locale: Locale;
  pathname: string;
  title?: string;
  description?: string;
  pageLocales?: Locale[];
}) {
  const locales = pageLocales ? pageLocales : routing.locales;
  const canonical = generateUrl(locale, pathname);

  const alternateLinks = locales.map((loc) => ({
    hrefLang: loc,
    href: generateUrl(loc, pathname),
  }));

  const languages = Object.fromEntries(alternateLinks.map((l) => [l.hrefLang, l.href]));
  languages["x-default"] = languages["en"];

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: {
      canonical,
      languages,
    },
  };
}
