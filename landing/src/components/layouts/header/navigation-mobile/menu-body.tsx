import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import Arrow from "@assets/icons/arrow.svg";
import LS from "@assets/icons/linken-sphere.svg";
import logo from "@public/images/logo-sm@2x.png";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { RESOURCES, SOLUTIONS, USE_CASES } from "../constants";
import { MobileMenuCategory } from "../types";
import { CloseButton, FirstLevelMenuItem, MenuListItem, SecondLevelMenuItem } from "./components";

type MenuBodyProps = {
  isMenuOpen: boolean;
  activeMenu: MobileMenuCategory;
  isPathActive: (href: string) => boolean;
  changeActiveMenu: (menu: MobileMenuCategory) => void;
  closeMobileMenu: () => void;
};

const MenuBody = ({ isMenuOpen, activeMenu, isPathActive, changeActiveMenu, closeMobileMenu }: MenuBodyProps) => {
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const tPages = useTranslations("navigation.pages");

  // reset menu to root after closing
  const handleMobileMenuTransitionEnd = (event: React.TransitionEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;
    if (!isMenuOpen) {
      changeActiveMenu("root");
    }
  };

  const resources1 = RESOURCES.slice(0, 4);
  const resources2 = RESOURCES.slice(4, 7);
  const resources3 = RESOURCES.slice(7);

  return (
    <div
      id="mobile-menu"
      inert={!isMenuOpen}
      onTransitionEnd={handleMobileMenuTransitionEnd}

      className={cn(
        "fixed top-0 right-0 z-20 flex h-dvh w-[calc(100%-48px)] flex-col backdrop-blur-2xl transition-transform duration-300",
        isMenuOpen ? "translate-x-0" : "translate-x-full",
      )}
    >
      {/* header */}
      <div className="flex shrink-0 items-center justify-between p-7 pb-5">
        {activeMenu !== "root" ? (
          <button
            type="button"
            onClick={() => changeActiveMenu("root")}
            aria-label={t("back")}
            className="flex size-9 items-center justify-center"
          >
            <Arrow aria-hidden="true" className="size-5 rotate-90" />
          </button>
        ) : (
          <Link
            className="flex h-full items-center gap-3"
            href="/"
            aria-label={tPages("homepage")}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            <Image src={logo} alt="Linken Sphere logo" className="h-12 w-auto scale-[1.2] rounded-full duration-300" />
            <LS aria-hidden="true" className="max-xxxs:hidden h-8 w-auto" />
          </Link>
        )}

        <CloseButton ariaLabel={t("closeMenu")} onClick={closeMobileMenu} />
      </div>

      {/* menu slides */}
      <ul className="relative mt-10 min-h-0 flex-1 overflow-hidden">
        {/* first level menu */}
        <MenuListItem
          className="[&>ul]:mt-0 [&>ul]:gap-6"
          menuName="root"
          relativeTo="mobile-root-submenu"
          activeMenu={activeMenu}
        >
          <FirstLevelMenuItem
            activeMenu={activeMenu}
            handleClick={changeActiveMenu}
            menuName="platform"
            relativeTo="mobile-platform-submenu"
            label={t("platform")}
          />

          <FirstLevelMenuItem
            activeMenu={activeMenu}
            handleClick={changeActiveMenu}
            menuName="use-cases"
            relativeTo="mobile-use-cases-submenu"
            label={t("useCases")}
          />

          <li>
            <Link
              className="flex text-2xl leading-[1.2] font-bold"
              href="/pricing"
              aria-current={isPathActive("/pricing") ? "page" : undefined}
            >
              {tPages("pricing")}
            </Link>
          </li>

          <FirstLevelMenuItem
            activeMenu={activeMenu}
            handleClick={changeActiveMenu}
            menuName="resources"
            relativeTo="mobile-resources-submenu"
            label={t("resources")}
          />
        </MenuListItem>

        {/* second level menu */}
        <MenuListItem
          activeMenu={activeMenu}
          menuName="platform"
          relativeTo="mobile-platform-submenu"
          label={t("platform")}
        >
          {SOLUTIONS.map(({ href, label, icon }) => (
            <SecondLevelMenuItem active={isPathActive(href)} key={href} label={tPages(label)} href={href} icon={icon} />
          ))}
        </MenuListItem>

        <MenuListItem
          activeMenu={activeMenu}
          menuName="use-cases"
          relativeTo="mobile-use-cases-submenu"
          label={t("useCases")}
        >
          {USE_CASES.map(({ href, label, icon }) => (
            <SecondLevelMenuItem active={isPathActive(href)} key={href} label={tPages(label)} href={href} icon={icon} />
          ))}
        </MenuListItem>

        <MenuListItem
          activeMenu={activeMenu}
          menuName="resources"
          relativeTo="mobile-resources-submenu"
          label={t("resources")}
        >
          {resources1.map(({ href, label, icon }) => (
            <SecondLevelMenuItem active={isPathActive(href)} key={href} label={tPages(label)} href={href} icon={icon} />
          ))}
          <hr className="border-white/10" />
          {resources2.map(({ href, label, icon }) => (
            <SecondLevelMenuItem active={isPathActive(href)} key={href} label={tPages(label)} href={href} icon={icon} />
          ))}
          <hr className="border-white/10" />
          {resources3.map(({ href, label, icon }) => (
            <SecondLevelMenuItem active={isPathActive(href)} key={href} label={tPages(label)} href={href} icon={icon} />
          ))}
        </MenuListItem>
      </ul>
    </div>
  );
};

export default MenuBody;
