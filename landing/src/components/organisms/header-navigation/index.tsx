"use client";

import { usePathname } from "@/i18n/navigation";
import { getLocaleHrefs, type LanguageNavigation } from "@/sanity/helpers";

import NavigationDesktop from "./navigation-desktop";
import NavigationMobile from "./navigation-mobile";

const Header = ({ languageNavigation }: { languageNavigation: LanguageNavigation }) => {
  const pathname = usePathname();
  const localeHrefs = getLocaleHrefs(pathname, languageNavigation);

  const isPathActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="pointer-events-none fixed top-5 left-0 z-50 w-full max-lg:px-5">
      <NavigationMobile isPathActive={isPathActive} localeHrefs={localeHrefs} />
      <NavigationDesktop isPathActive={isPathActive} localeHrefs={localeHrefs} />
    </header>
  );
};

export default Header;
