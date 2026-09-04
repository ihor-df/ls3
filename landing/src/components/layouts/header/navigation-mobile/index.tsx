import ButtonRounded from "@/components/atoms/button-rounded";
import useScrollLock from "@/hooks/useScrollLock";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MobileSlide } from "../types";

import Menu from "@assets/icons/menu.svg";
import logo from "@public/images/logo-sm@2x.png";
import MenuBody from "./menu-body";

type NavigationMobileProps = {
  isPathActive: (href: string) => boolean;
  changeLocale: (locale: string) => void;
};

const NavigationMobile = ({ isPathActive }: NavigationMobileProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MobileSlide>("root");

  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const tPages = useTranslations("navigation.pages");

  useScrollLock(isMenuOpen);

  const openMobileMenu = () => {
    setActiveMenu("root");
    setIsMenuOpen(true);
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  const changeActiveMenu = (menu: MobileSlide) => {
    setActiveMenu(menu);
  };

  // close menu on change screen size to > lg
  useEffect(() => {
    if (!isMenuOpen) return;
    const desktop = window.matchMedia("(min-width: 64rem)");
    const closeOnDesktop = () => {
      if (desktop.matches) setIsMenuOpen(false);
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
            "aria-expanded": activeMenu === "language",
            "aria-label": t("changeLanguage", { language: locale.toUpperCase() }),
            "aria-controls": "language-submenu",
            // onClick: () => openSecondLevelMenu("language"),
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
            "aria-label": "Open mobile menu",
            "aria-controls": "root-submenu",
            onClick: openMobileMenu,
          }}
        >
          <Menu className="size-5" />
        </ButtonRounded>
      </div>

      {/* Backdrop */}
      <div
        className={cn(
          "pointer-events-none fixed inset-0 z-10 transition-colors",
          isMenuOpen && "pointer-events-auto bg-black/30",
        )}
        onClick={(e) => {
          if (e.target !== e.currentTarget) return;
          closeMobileMenu();
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
    </nav>
  );
};

export default NavigationMobile;
