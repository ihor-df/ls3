import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PRODUCTION_DOMAIN } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export const appDomain = () => PRODUCTION_DOMAIN; // process.env.NEXT_PUBLIC_APP_DOMAIN
export const metadataAppDomain = () => appDomain() ?? PRODUCTION_DOMAIN;
export const isProduction = () => appDomain() === PRODUCTION_DOMAIN;

export const hostName = () => {
  return `https://${metadataAppDomain()}`;
};

export const normalizePathname = (pathname: string) => {
  if (!pathname || pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
};

export const buildAbsoluteUrl = (locale: string, pathname: string) => {
  const origin = hostName();
  if (!origin) return "";

  const normalizedPathname = normalizePathname(pathname);

  const localizedPathname =
    normalizedPathname === "/"
      ? locale === "en"
        ? "/"
        : `/${locale}`
      : locale === "en"
        ? normalizedPathname
        : `/${locale}${normalizedPathname}`;

  return `${origin}${localizedPathname}`;
};
