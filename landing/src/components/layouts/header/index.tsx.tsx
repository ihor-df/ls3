"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import logo from "@public/images/logo-sm@2x.png";
import { Locale, useLocale } from "next-intl";
import Image from "next/image";

import { useEffect, useState } from "react";
import ButtonRounded from "../../atoms/button-rounded";
import Button from "../../atoms/main-button";
import SecondLevelMenuItem from "./components";
import { LOCALES_DATA, RESOURCES, SOLUTIONS, USE_CASES } from "./constants";

type HeaderProps = {};
type MenuCategory = "platform" | "use-cases" | "resources" | "language";

const Header = ({}: HeaderProps) => {
  const [activeMenu, setActiveMenu] = useState<MenuCategory>();

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const isOpen = activeMenu !== undefined;

  const menuCategoryClick = (category: MenuCategory) => {
    if (category === activeMenu) {
      setActiveMenu(undefined);
    } else {
      setActiveMenu(category);
    }
  };

  const isPrivacyPages = pathname.includes("privacy") || pathname.includes("license");
  const availableLocales = isPrivacyPages ? LOCALES_DATA.filter((locale) => locale.code === "en") : LOCALES_DATA;

  const changeLocale = (locale: Locale) => {
    if (!availableLocales.some((l) => l.code === locale)) return; // invalid locale
    router.replace(pathname, { locale });
  };

  useEffect(() => {
    setActiveMenu(undefined);
  }, [pathname]);

  return (
    <header className="pointer-events-none fixed top-5 left-0 z-50 w-full">
      <nav
        aria-label="main navigation"
        className={cn(
          "glass-border rounded-large pointer-events-auto mx-auto max-w-max overflow-hidden bg-white/10 backdrop-blur-xl", // bg-[#3B3B3B]/20
          "transition-[padding,border-radius] duration-300 ease-out",
          isOpen ? "p-1" : "rounded-full p-0",
        )}
      >
        <div
          className={cn(
            "flex h-19 items-center gap-10 rounded-full border border-transparent px-3 py-2 transition-colors",
            isOpen && "border-white/10 bg-white/10",
          )}
        >
          <Link className="max-h-max" href="/" aria-label="Linken Sphere — homepage">
            <Image src={logo} alt="Linken Sphere logo" className="h-auto w-16 rounded-full" />
          </Link>

          <ul className="flex h-full items-center gap-7 text-nowrap [&>li]:h-full [&>li>*]:h-full">
            <li>
              <button
                type="button"
                className="cursor-pointer"
                aria-expanded={activeMenu === "platform"}
                aria-controls="platform-submenu"
                onClick={() => menuCategoryClick("platform")}
              >
                Platform
              </button>
            </li>

            <li>
              <button
                type="button"
                className="cursor-pointer"
                aria-expanded={activeMenu === "use-cases"}
                aria-controls="use-cases-submenu"
                onClick={() => menuCategoryClick("use-cases")}
              >
                Use cases
              </button>
            </li>

            <li>
              <Link className="flex items-center" href="/pricing">
                Pricing
              </Link>
            </li>

            <li>
              <button
                type="button"
                className="cursor-pointer"
                aria-expanded={activeMenu === "resources"}
                aria-controls="resources-submenu"
                onClick={() => menuCategoryClick("resources")}
              >
                Resources
              </button>
            </li>
          </ul>

          <div className="flex items-center gap-2">
            <ButtonRounded
              className="uppercase"
              buttonProps={{
                "aria-expanded": activeMenu === "language",
                "aria-label": `Change language, current language ${locale}`,
                "aria-controls": "language-submenu",
                onClick: () => menuCategoryClick("language"),
              }}
            >
              {locale}
            </ButtonRounded>

            <Button header>Start for free</Button>
          </div>
        </div>

        {/* menu body */}
        <div
          className={cn("grid transition-all duration-300", isOpen ? "grid-rows-[1fr] p-3 pt-5" : "grid-rows-[0fr]")}
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
