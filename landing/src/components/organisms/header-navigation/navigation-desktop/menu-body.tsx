import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

import { RESOURCES, SOLUTIONS, USE_CASES } from "../constants";
import { MenuCategory } from "../types";
import { SecondLevelMenu, SecondLevelMenuItem } from "./components";
import LangSwitcher from "./lang-switcher";

type MenuBodyProps = {
  isMenuOpen: boolean;
  activeMenu: MenuCategory | undefined;
  renderedMenu: MenuCategory | undefined;
  isPathActive: (href: string) => boolean;
  changeLocale: (locale: string) => void;
};

const MenuBody = ({ renderedMenu, isMenuOpen, activeMenu, isPathActive, changeLocale }: MenuBodyProps) => {
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

          {/* Language switcher */}
          <LangSwitcher changeLocale={changeLocale} renderedMenu={renderedMenu} activeMenu={activeMenu} />
        </ul>
      </div>
    </div>
  );
};

export default MenuBody;
