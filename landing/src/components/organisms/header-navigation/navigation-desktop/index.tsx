import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import ButtonRounded from "@components/atoms/button-rounded";
import Button from "@components/atoms/main-button";
import logo from "@public/images/logo-sm@2x.png";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

import { MenuCategory } from "../types";
import { FirstLevelMenuItem } from "./components";
import MenuBody from "./menu-body";

type NavigationDesktopProps = {
  isPathActive: (href: string) => boolean;
  changeLocale: (locale: string) => void;
};

const NavigationDesktop = ({ isPathActive, changeLocale }: NavigationDesktopProps) => {
  const [activeMenu, setActiveMenu] = useState<MenuCategory>();
  const [clickedMenu, setClickedMenu] = useState<MenuCategory>();
  const [renderedMenu, setRenderedMenu] = useState<MenuCategory>();

  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const tCta = useTranslations("common.cta.getStarted");
  const tPages = useTranslations("navigation.pages");
  const navRef = useRef<HTMLElement>(null);

  const isMenuOpen = activeMenu !== undefined;

  const handleSecondMenuClick = (category: MenuCategory) => {
    const nextMenu = clickedMenu === category ? undefined : category;

    setClickedMenu(nextMenu);
    setActiveMenu(nextMenu);

    if (nextMenu) {
      setRenderedMenu(nextMenu);
    }
  };

  const closeSecondMenu = useCallback(() => {
    setActiveMenu(undefined);
    setClickedMenu(undefined);
  }, []);

  const handleSecondMenuHover = (category: MenuCategory) => {
    setRenderedMenu(category);
    setActiveMenu(category);
  };

  const handleMenuMouseLeave = () => {
    setActiveMenu(clickedMenu);
    if (clickedMenu) {
      setRenderedMenu(clickedMenu);
    }
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Escape" || !activeMenu) return;
    const trigger = navRef.current?.querySelector<HTMLButtonElement>('button[aria-expanded="true"]');

    event.preventDefault();
    closeSecondMenu();
    trigger?.focus();
  };

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        closeSecondMenu();
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [closeSecondMenu]);

  useEffect(() => {
    closeSecondMenu();
  }, [pathname, closeSecondMenu]);

  return (
    <nav
      ref={navRef}
      aria-label={t("mainNavigation")}
      onKeyDown={handleMenuKeyDown}
      onMouseLeave={handleMenuMouseLeave}
      className={cn(
        "glass-border rounded-large pointer-events-auto mx-auto max-w-max overflow-hidden backdrop-blur-xl max-lg:hidden",
        "transition-[padding] duration-300 ease-out",
        isMenuOpen ? "lg:bg-black/10 lg:p-1" : "rounded-full p-0",
      )}
    >
      <div
        className={cn(
          "flex h-19 items-center gap-10 rounded-full border border-transparent bg-white/10 px-3 py-2",
          isMenuOpen && "border-white/10",
        )}
      >
        <Link
          className="max-h-max"
          href="/"
          aria-label={tPages("homepage")}
          aria-current={pathname === "/" ? "page" : undefined}
        >
          <Image src={logo} alt="Linken Sphere logo" className="h-auto w-16 scale-[1.1] rounded-full duration-300" />
        </Link>

        {/* First level menu */}
        <ul className="flex h-full items-center gap-7 text-nowrap [&>li]:h-full [&>li>*]:h-full">
          <FirstLevelMenuItem
            label={t("platform")}
            menuName="platform"
            relativeTo="desktop-platform-submenu"
            handleClick={handleSecondMenuClick}
            handleMouseEnter={handleSecondMenuHover}
            activeMenu={activeMenu}
          />

          <FirstLevelMenuItem
            label={t("useCases")}
            menuName="use-cases"
            relativeTo="desktop-use-cases-submenu"
            handleClick={handleSecondMenuClick}
            handleMouseEnter={handleSecondMenuHover}
            activeMenu={activeMenu}
          />

          <li>
            <Link
              className="flex items-center underline decoration-transparent transition-colors hover:decoration-white"
              href="/pricing"
              aria-current={isPathActive("/pricing") ? "page" : undefined}
            >
              {tPages("pricing")}
            </Link>
          </li>

          <FirstLevelMenuItem
            label={t("resources")}
            menuName="resources"
            relativeTo="desktop-resources-submenu"
            handleClick={handleSecondMenuClick}
            handleMouseEnter={handleSecondMenuHover}
            activeMenu={activeMenu}
          />
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <ButtonRounded
            className="uppercase"
            buttonProps={{
              "aria-expanded": activeMenu === "language",
              "aria-label": t("changeLanguage", { language: locale.toUpperCase() }),
              "aria-controls": "desktop-language-menu",
              onClick: () => handleSecondMenuClick("language"),
              onMouseEnter: () => handleSecondMenuHover("language"),
            }}
          >
            {locale}
          </ButtonRounded>

          <Button header>{tCta("button")}</Button>
        </div>
      </div>

      {/* menu body */}
      <MenuBody
        isMenuOpen={isMenuOpen}
        activeMenu={activeMenu}
        renderedMenu={renderedMenu}
        isPathActive={isPathActive}
        changeLocale={changeLocale}
      />
    </nav>
  );
};

export default NavigationDesktop;
