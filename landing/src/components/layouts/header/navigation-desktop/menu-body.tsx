import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

import { LangSwitcherItem } from "../components";
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
            relativeTo="desktop-platform-submenu"
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
            relativeTo="desktop-use-cases-submenu"
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
            relativeTo="desktop-resources-submenu"
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
            relativeTo="desktop-language-menu"
            menuName="language"
            activeMenu={activeMenu}
          >
            {LOCALES_DATA.map((data) => {
              return <LangSwitcherItem key={data.code} {...data} changeLocale={changeLocale} locale={locale} />;
            })}
          </SecondLevelMenu>
        </ul>
      </div>
    </div>
  );
};

export default MenuBody;
