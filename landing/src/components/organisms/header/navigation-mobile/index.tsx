import ButtonRounded from "@/components/atoms/button-rounded";
import useScrollLock from "@/hooks/useScrollLock";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MobileMenuCategory } from "../types";

import Menu from "@assets/icons/menu.svg";
import logo from "@public/images/logo-sm@2x.png";
import { LangSwitcherItem } from "../components";
import { LOCALES_DATA } from "../constants";
import { CloseButton } from "./components";
import MenuBody from "./menu-body";

type NavigationMobileProps = {
  isPathActive: (href: string) => boolean;
  changeLocale: (locale: string) => void;
};

const NavigationMobile = ({ isPathActive, changeLocale }: NavigationMobileProps) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MobileMenuCategory>("root");

  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const tPages = useTranslations("navigation.pages");

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

  const handleLocaleChange = (locale: string) => {
    changeLocale(locale);
    closeLangMenu();
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
  }, [pathname]);

  return (
    <nav aria-label={t("mainNavigation")} className="pointer-events-auto lg:hidden">
      <div
        className={cn(
          "glass-border relative z-10 flex h-16 w-full items-center justify-between rounded-full bg-white/10 p-2 backdrop-blur-xl",
        )}
      >
        <ButtonRounded
          className="size-12 font-bold uppercase"
          buttonProps={{
            "aria-expanded": isLangMenuOpen,
            "aria-label": t("changeLanguage", { language: locale.toUpperCase() }),
            "aria-controls": "mobile-language-menu",
            onClick: () => openLangMenu(),
          }}
        >
          {locale}
        </ButtonRounded>

        <Link
          className="h-full"
          href="/"
          aria-label={tPages("homepage")}
          aria-current={pathname === "/" ? "page" : undefined}
        >
          <Image src={logo} alt="Linken Sphere logo" className="h-full w-auto scale-[1.2] rounded-full duration-300" />
        </Link>

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

      {/* menu body */}
      <MenuBody
        isMenuOpen={isMenuOpen}
        activeMenu={activeMenu}
        isPathActive={isPathActive}
        changeActiveMenu={changeActiveMenu}
        closeMobileMenu={closeMobileMenu}
      />

      {/* Lang switcher */}
      <div
        id="mobile-language-menu"
        inert={!isLangMenuOpen}

        className={cn(
          "fixed top-0 left-0 z-20 flex h-dvh w-62 flex-col backdrop-blur-2xl transition-transform duration-300",
          isLangMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* header */}
        <div className="flex shrink-0 items-center justify-between p-7 pb-5">
          <CloseButton ariaLabel={t("closeMenu")} onClick={closeLangMenu} />
        </div>

        <ul className="custom-scrollbar overflow-auto px-5 pt-10 pb-20">
          {LOCALES_DATA.map((data) => {
            return (
              <LangSwitcherItem
                key={data.code}
                {...data}
                className="text-xl"
                changeLocale={handleLocaleChange}
                locale={locale}
              />
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default NavigationMobile;
