"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { Locale } from "next-intl";

import { LOCALES_DATA } from "./constants";
import NavigationDesktop from "./navigation-desktop";
import NavigationMobile from "./navigation-mobile";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isPathActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const isPrivacyPages = pathname.includes("privacy") || pathname.includes("license");
  const availableLocales = isPrivacyPages ? LOCALES_DATA.filter((locale) => locale.code === "en") : LOCALES_DATA;

  const changeLocale = (locale: Locale) => {
    if (!availableLocales.some((l) => l.code === locale)) return; // invalid locale
    router.replace(pathname, { locale });
  };

  return (
    <header className="pointer-events-none fixed top-5 left-0 z-50 w-full max-lg:px-5">
      <NavigationMobile />
      <NavigationDesktop isPathActive={isPathActive} changeLocale={changeLocale} />
    </header>
  );
};

export default Header;
