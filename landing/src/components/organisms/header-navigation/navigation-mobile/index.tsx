import ButtonRounded from "@/components/atoms/button-rounded";
import useScrollLock from "@/hooks/useScrollLock";
import { Link, usePathname } from "@/i18n/navigation";
import { BLOG_SEARCH_MAX_LENGTH, isBlogListingPath } from "@/lib/blog-search";
import { isPartnersListingPath, PARTNERS_SEARCH_MAX_LENGTH } from "@/lib/partners-search";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { MobileMenuCategory } from "../types";

import Menu from "@assets/icons/menu.svg";
import logo from "@public/images/logo-sm@2x.png";

import MobilePageSearch from "../../../molecules/page-search-mobile";
import LangSwitcher from "./lang-switcher";
import MenuBody from "./menu-body";

type NavigationMobileProps = {
  isPathActive: (href: string) => boolean;
  changeLocale: (locale: string) => void;
};

const NavigationMobile = ({ isPathActive, changeLocale }: NavigationMobileProps) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MobileMenuCategory>("root");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const tPages = useTranslations("navigation.pages");
  const isBlogListing = isBlogListingPath(pathname);
  const isPartnersListing = isPartnersListingPath(pathname);
  const hasSearch = pathname === "/version-history" || isBlogListing || isPartnersListing;

  useScrollLock(isMenuOpen || isLangMenuOpen);

  const openMobileMenu = () => {
    setActiveMenu("root");
    setIsMenuOpen(true);
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  const changeActiveMenu = (menu: MobileMenuCategory) => {
    setActiveMenu(menu);
  };

  const openLangMenu = () => {
    if (isMenuOpen) closeMobileMenu();
    setIsLangMenuOpen(true);
  };

  const closeLangMenu = () => {
    setIsLangMenuOpen(false);
  };

  // close menu on change screen size to > lg
  useEffect(() => {
    if (!isMenuOpen) return;
    const desktop = window.matchMedia("(min-width: 64rem)");
    const closeOnDesktop = () => {
      if (!desktop.matches) return;
      setIsMenuOpen(false);
      closeLangMenu();
    };

    closeOnDesktop();
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    closeMobileMenu();
    setIsSearchOpen(false);
  }, [pathname]);

  return (
    <nav aria-label={t("mainNavigation")} className="pointer-events-auto lg:hidden">
      <div
        className={cn(
          "glass-border relative z-10 flex h-16 w-full items-center justify-between rounded-full bg-white/10 p-2 backdrop-blur-xl",
        )}
      >
        <ButtonRounded
          className={cn(
            "size-12 font-bold uppercase transition-[color,background-color,opacity,transform] duration-200",
            isSearchOpen && "pointer-events-none scale-90 opacity-0",
          )}
          buttonProps={{
            inert: isSearchOpen,
            "aria-expanded": isLangMenuOpen,
            "aria-label": t("changeLanguage", { language: locale.toUpperCase() }),
            "aria-controls": "mobile-language-menu",
            onClick: () => openLangMenu(),
          }}
        >
          {locale}
        </ButtonRounded>

        <Link
          className={cn(
            "absolute top-0 left-1/2 h-full -translate-x-1/2 transition-opacity duration-200",
            isSearchOpen && "pointer-events-none opacity-0",
          )}
          inert={isSearchOpen}
          href="/"
          aria-label={tPages("homepage")}
          aria-current={pathname === "/" ? "page" : undefined}
        >
          <Image src={logo} alt="Linken Sphere logo" className="h-16 w-auto rounded-full duration-300" />
        </Link>

        <div
          onBlur={(event) => {
            const focusLeftSearch = !event.currentTarget.contains(event.relatedTarget);
            const hasSearchValue = Boolean(event.currentTarget.querySelector("input")?.value.trim());

            if (focusLeftSearch && !hasSearchValue) setIsSearchOpen(false);
          }}
          className={cn(
            "absolute top-2 right-2 z-10 flex h-12 gap-1 transition-[width] ease-out",
            hasSearch ? "w-25" : "w-12",
            isSearchOpen && "w-[calc(100%-1rem)]",
          )}
        >
          {hasSearch && (
            <Suspense fallback={<div className="h-12 min-w-0 flex-1 rounded-full bg-white/10" aria-hidden="true" />}>
              <MobilePageSearch
                onOpen={setIsSearchOpen}
                isOpen={isSearchOpen}
                maxLength={
                  isBlogListing ? BLOG_SEARCH_MAX_LENGTH : isPartnersListing ? PARTNERS_SEARCH_MAX_LENGTH : undefined
                }
              />
            </Suspense>
          )}

          {!isSearchOpen && (
            <ButtonRounded
              className="size-12 uppercase"
              buttonProps={{
                "aria-expanded": isMenuOpen,
                "aria-label": t("openMenu"),
                "aria-controls": "mobile-root-submenu",
                onClick: openMobileMenu,
              }}
            >
              <Menu aria-hidden="true" className="size-5" />
            </ButtonRounded>
          )}
        </div>
      </div>

      {/* Backdrop */}
      <div
        className={cn(
          "pointer-events-none fixed inset-0 z-10 transition-colors",
          (isMenuOpen || isLangMenuOpen) && "pointer-events-auto bg-black/30",
        )}
        onClick={(e) => {
          if (e.target !== e.currentTarget) return;
          closeMobileMenu();
          closeLangMenu();
        }}
      />

      {/* Menu body */}
      <MenuBody
        isMenuOpen={isMenuOpen}
        activeMenu={activeMenu}
        isPathActive={isPathActive}
        changeActiveMenu={changeActiveMenu}
        closeMobileMenu={closeMobileMenu}
      />

      {/* Lang switcher */}
      <LangSwitcher isLangMenuOpen={isLangMenuOpen} closeLangMenu={closeLangMenu} changeLocale={changeLocale} />
    </nav>
  );
};

export default NavigationMobile;
