"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import logo from "@public/images/logo-sm@2x.png";
import { Locale, useLocale, useTranslations } from "next-intl";
import Image from "next/image";

import { type KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import ButtonRounded from "../../atoms/button-rounded";
import Button from "../../atoms/main-button";
import { FirstLevelMenuItem, SecondLevelMenu, SecondLevelMenuItem } from "./components";
import { LOCALES_DATA, RESOURCES, SOLUTIONS, USE_CASES } from "./constants";

export type MenuCategory = "platform" | "use-cases" | "resources" | "language";

const Header = () => {
  const [activeMenu, setActiveMenu] = useState<MenuCategory>();
  const [clickedMenu, setClickedMenu] = useState<MenuCategory>();
  const [renderedMenu, setRenderedMenu] = useState<MenuCategory>();

  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("navigation");
  const tPages = useTranslations("navigation.pages");
  const tCta = useTranslations("common.cta.getStarted");

  const isOpen = activeMenu !== undefined;
  const isPathActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const handleSecondMenuClick = (category: MenuCategory) => {
    const nextMenu = clickedMenu === category ? undefined : category;

    setClickedMenu(nextMenu);
    setActiveMenu(nextMenu);

    if (nextMenu) {
      setRenderedMenu(nextMenu);
    }
  };

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

  const closeSecondMenu = useCallback(() => {
    setActiveMenu(undefined);
    setClickedMenu(undefined);
  }, []);

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Escape" || !activeMenu) return;

    const trigger = navRef.current?.querySelector<HTMLButtonElement>(`button[aria-controls="${activeMenu}-submenu"]`);

    event.preventDefault();
    closeSecondMenu();
    trigger?.focus();
  };

  const isPrivacyPages = pathname.includes("privacy") || pathname.includes("license");
  const availableLocales = isPrivacyPages ? LOCALES_DATA.filter((locale) => locale.code === "en") : LOCALES_DATA;

  const changeLocale = (locale: Locale) => {
    if (!availableLocales.some((l) => l.code === locale)) return; // invalid locale
    router.replace(pathname, { locale });
  };

  useEffect(() => {
    closeSecondMenu();
  }, [pathname, closeSecondMenu]);

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

  return (
    <header className="pointer-events-none fixed top-5 left-0 z-50 w-full">
      <nav
        ref={navRef}
        aria-label={t("mainNavigation")}
        onKeyDown={handleMenuKeyDown}
        onMouseLeave={handleMenuMouseLeave}
        className={cn(
          "glass-border rounded-large pointer-events-auto mx-auto max-w-max overflow-hidden backdrop-blur-xl",
          "transition-[padding] duration-300 ease-out",
          isOpen ? "bg-black/10 p-1" : "rounded-full p-0",
        )}
      >
        <div
          className={cn(
            "flex h-19 items-center gap-10 rounded-full border border-transparent bg-white/10 px-3 py-2",
            isOpen && "border-white/10",
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

          <ul className="flex h-full items-center gap-7 text-nowrap [&>li]:h-full [&>li>*]:h-full">
            <FirstLevelMenuItem
              label={t("platform")}
              menuName="platform"
              relativeTo="platform-submenu"
              handleClick={handleSecondMenuClick}
              handleMouseEnter={handleSecondMenuHover}
              activeMenu={activeMenu}
            />

            <FirstLevelMenuItem
              label={t("useCases")}
              menuName="use-cases"
              relativeTo="use-cases-submenu"
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
              relativeTo="resources-submenu"
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
                "aria-controls": "language-submenu",
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
        <div
          aria-hidden={!isOpen}
          inert={!isOpen}
          className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-out",
            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <ul className="p-3 pt-5">
              <SecondLevelMenu
                renderedMenu={renderedMenu}
                relativeTo="platform-submenu"
                menuName="platform"
                activeMenu={activeMenu}
              >
                {SOLUTIONS.map(({ href, label, icon }) => {
                  return (
                    <SecondLevelMenuItem
                      active={isPathActive(href)}
                      key={href}
                      label={tPages(label)}
                      href={href}
                      icon={icon}
                    />
                  );
                })}
              </SecondLevelMenu>

              <SecondLevelMenu
                renderedMenu={renderedMenu}
                relativeTo="use-cases-submenu"
                menuName="use-cases"
                activeMenu={activeMenu}
              >
                {USE_CASES.map(({ href, label, icon }) => {
                  return (
                    <SecondLevelMenuItem
                      active={isPathActive(href)}
                      key={href}
                      label={tPages(label)}
                      href={href}
                      icon={icon}
                    />
                  );
                })}
              </SecondLevelMenu>

              <SecondLevelMenu
                renderedMenu={renderedMenu}
                relativeTo="resources-submenu"
                menuName="resources"
                activeMenu={activeMenu}
              >
                {RESOURCES.map(({ href, label, icon }) => {
                  return (
                    <SecondLevelMenuItem
                      active={isPathActive(href)}
                      key={href}
                      label={tPages(label)}
                      href={href}
                      icon={icon}
                    />
                  );
                })}
              </SecondLevelMenu>

              {/* Locale switcher */}
              <SecondLevelMenu
                renderedMenu={renderedMenu}
                relativeTo="language-submenu"
                menuName="language"
                activeMenu={activeMenu}
              >
                {LOCALES_DATA.map(({ code, label, icon }) => {
                  const Icon = icon;
                  return (
                    <li
                      key={code}
                      className={cn(
                        "rounded-full transition-colors duration-300 hover:bg-white/10",
                        locale === code && "bg-white/10",
                      )}
                    >
                      <button
                        onClick={() => changeLocale(code)}
                        aria-pressed={locale === code}
                        className="flex max-w-52 cursor-pointer items-center gap-4 p-3 leading-[1.1] tracking-[-0.01em]"
                      >
                        <span className="flex size-10 min-w-10 items-center justify-center rounded-full bg-white/10">
                          <Icon className="size-5" />
                        </span>
                        {label}
                      </button>
                    </li>
                  );
                })}
              </SecondLevelMenu>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
