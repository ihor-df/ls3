import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { LOCALES_DATA, RESOURCES, SOLUTIONS, USE_CASES } from "../constants";
import { MenuCategory } from "../types";
import { SecondLevelMenu, SecondLevelMenuItem } from "./components";

type MenuBodyProps = {
  isMenuOpen: boolean;
  activeMenu: MenuCategory | undefined;
  renderedMenu: MenuCategory | undefined;
  isPathActive: (href: string) => boolean;
  changeLocale: (locale: string) => void;
};

const MenuBody = ({ renderedMenu, isMenuOpen, activeMenu, isPathActive, changeLocale }: MenuBodyProps) => {
  const locale = useLocale();
  const tPages = useTranslations("navigation.pages");

  const faq = RESOURCES.find((item) => item.label === "faq");
  const sortedResources = faq ? [...RESOURCES.filter((item) => item.label !== "faq"), faq] : RESOURCES;

  return (
    <div
      inert={!isMenuOpen}
      className={cn(
        "grid transition-[grid-template-rows] duration-300 ease-out",
        isMenuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
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
            {sortedResources.map(({ href, label, icon }) => {
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
                    className="flex w-full cursor-pointer items-center gap-4 p-3 leading-[1.1] tracking-[-0.01em]"
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
  );
};

export default MenuBody;
