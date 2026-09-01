"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import logo from "@public/images/logo-sm@2x.png";
import { Locale, useLocale } from "next-intl";
import Image from "next/image";

import { useCallback, useEffect, useRef, useState } from "react";
import ButtonRounded from "../../atoms/button-rounded";
import Button from "../../atoms/main-button";
import { FirstLevelMenuItem, SecondLevelMenuItem } from "./components";
import { LOCALES_DATA, RESOURCES, SOLUTIONS, USE_CASES } from "./constants";

export type MenuCategory = "platform" | "use-cases" | "resources" | "language";

const Header = () => {
  const [activeMenu, setActiveMenu] = useState<MenuCategory>();
  const [clickedMenu, setClickedMenu] = useState<MenuCategory>();
  const navRef = useRef<HTMLElement>(null);

  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const isOpen = activeMenu !== undefined;

  const handleSecondMenuClick = (category: MenuCategory) => {
    const nextMenu = clickedMenu === category ? undefined : category;

    setClickedMenu(nextMenu);
    setActiveMenu(nextMenu);
  };

  const handleSecondMenuHover = (category: MenuCategory) => {
    setActiveMenu(category);
  };

  const closeSecondMenu = useCallback(() => {
    setActiveMenu(undefined);
    setClickedMenu(undefined);
  }, []);

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
        aria-label="main navigation"
        onMouseLeave={() => setActiveMenu(clickedMenu)}
        className={cn(
          "glass-border rounded-large pointer-events-auto mx-auto max-w-max overflow-hidden backdrop-blur-xl",
          "transition-[padding,border-radius,colors] duration-300 ease-out",
          isOpen ? "bg-black/10 p-1" : "rounded-full p-0",
        )}
      >
        <div
          className={cn(
            "flex h-19 items-center gap-10 rounded-full border border-transparent bg-white/10 px-3 py-2 transition-colors",
            isOpen && "border-white/10",
          )}
        >
          <Link className="max-h-max" href="/" aria-label="Linken Sphere — homepage">
            <Image
              src={logo}
              alt="Linken Sphere logo"
              className="transition-scale h-auto w-16 scale-[1.1] rounded-full duration-300 hover:scale-[1.2]"
            />
          </Link>

          <ul className="flex h-full items-center gap-7 text-nowrap [&>li]:h-full [&>li>*]:h-full">
            <FirstLevelMenuItem
              label="Platform"
              menuName="platform"
              relativeTo="platform-submenu"
              handleClick={handleSecondMenuClick}
              handleMouseEnter={handleSecondMenuHover}
              activeMenu={activeMenu}
            />

            <FirstLevelMenuItem
              label="Use cases"
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
              >
                Pricing
              </Link>
            </li>

            <FirstLevelMenuItem
              label="Resources"
              menuName="resources"
              relativeTo="resources-submenu"
              handleClick={handleSecondMenuClick}
              handleMouseEnter={handleSecondMenuHover}
              activeMenu={activeMenu}
            />
          </ul>

          <div className="flex items-center gap-2">
            <ButtonRounded
              className="uppercase"
              buttonProps={{
                "aria-expanded": activeMenu === "language",
                "aria-label": `Change language, current language ${locale}`,
                "aria-controls": "language-submenu",
                onClick: () => handleSecondMenuClick("language"),
                onMouseEnter: () => handleSecondMenuHover("language"),
              }}
            >
              {locale}
            </ButtonRounded>

            <Button header>Start for free</Button>
          </div>
        </div>

        {/* menu body */}
        <div
          className={cn(
            "grid transition-all duration-400 ease-in-out",
            isOpen ? "grid-rows-[1fr] p-3 pt-5" : "grid-rows-[0fr]",
          )}
        >
          <ul className="grid grid-cols-3 gap-x-10 gap-y-1" id="platform-submenu" hidden={activeMenu !== "platform"}>
            {SOLUTIONS.map(({ href, label, icon }) => {
              return (
                <SecondLevelMenuItem
                  active={pathname.startsWith(href)}
                  key={href}
                  label={label}
                  href={href}
                  icon={icon}
                />
              );
            })}
          </ul>

          <ul className="grid grid-cols-3 gap-x-10 gap-y-1" id="use-cases-submenu" hidden={activeMenu !== "use-cases"}>
            {USE_CASES.map(({ href, label, icon }) => {
              return (
                <SecondLevelMenuItem
                  active={pathname.startsWith(href)}
                  key={href}
                  label={label}
                  href={href}
                  icon={icon}
                />
              );
            })}
          </ul>

          <ul className="grid grid-cols-3 gap-x-10 gap-y-1" id="resources-submenu" hidden={activeMenu !== "resources"}>
            {RESOURCES.map(({ href, label, icon }) => {
              return (
                <SecondLevelMenuItem
                  active={pathname.startsWith(href)}
                  key={href}
                  label={label}
                  href={href}
                  icon={icon}
                />
              );
            })}
          </ul>

          <ul className="grid grid-cols-3 gap-x-10 gap-y-1" id="language-submenu" hidden={activeMenu !== "language"}>
            {LOCALES_DATA.map(({ code, label, icon }) => {
              const Icon = icon;
              return (
                <li
                  key={code}
                  className={cn(
                    "group rounded-full transition-colors duration-300 hover:bg-white/10",
                    locale === code && "bg-white/10",
                  )}
                >
                  <button
                    onClick={() => changeLocale(code)}
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
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
