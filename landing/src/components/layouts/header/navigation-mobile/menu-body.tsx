import ButtonRounded from "@/components/atoms/button-rounded";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import Arrow from "@assets/icons/arrow.svg";
import Cross from "@assets/icons/cross.svg";
import LS from "@assets/icons/linken-sphere.svg";
import logo from "@public/images/logo-sm@2x.png";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { TransitionEvent } from "react";
import { RESOURCES, SOLUTIONS, USE_CASES } from "../constants";
import { MenuCategory, MobileSlide } from "../types";
import { FirstLevelMenuItem, SecondLevelMenu, SecondLevelMenuItem } from "./components";

type MenuBodyProps = {
  isMenuOpen: boolean;
  activeMenu: MobileSlide;
  handleMobileMenuTransitionEnd: (event: TransitionEvent<HTMLElement>) => void;
  goBack: () => void;
  isPathActive: (href: string) => boolean;
  openSecondLevelMenu: (menu: MenuCategory) => void;
  closeMobileMenu: () => void;
};

const MenuBody = ({
  isMenuOpen,
  activeMenu,
  handleMobileMenuTransitionEnd,
  goBack,
  isPathActive,
  openSecondLevelMenu,
  closeMobileMenu,
}: MenuBodyProps) => {
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const tPages = useTranslations("navigation.pages");

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
          <button type="button" onClick={() => goBack()} className="flex size-9 items-center justify-center">
            <Arrow className="size-5 rotate-90" />
          </button>
        ) : (
          <Link
            className="flex h-full items-center gap-3"
            href="/"
            aria-label={tPages("homepage")}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            <Image src={logo} alt="Linken Sphere logo" className="h-12 w-auto scale-[1.2] rounded-full duration-300" />
            <LS className="max-xxxs:hidden h-8 w-auto" />
          </Link>
        )}

        <ButtonRounded
          className="size-12 uppercase"
          buttonProps={{
            "aria-label": "Close mobile menu",
            onClick: closeMobileMenu,
          }}
        >
          <Cross className="size-5" />
        </ButtonRounded>
      </div>

      {/* menu slides */}
      <ul className="relative mt-10 min-h-0 flex-1 overflow-hidden">
        {/* first level menu */}
        <SecondLevelMenu
          className="[&>ul]:mt-0 [&>ul]:gap-6"
          menuName="root"
          relativeTo="root-submenu"
          activeMenu={activeMenu}
        >
          <FirstLevelMenuItem
            activeMenu={activeMenu}
            handleClick={openSecondLevelMenu}
            menuName="platform"
            relativeTo="platform-submenu"
            label={t("platform")}
          />

          <FirstLevelMenuItem
            activeMenu={activeMenu}
            handleClick={openSecondLevelMenu}
            menuName="use-cases"
            relativeTo="use-cases-submenu"
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
            handleClick={openSecondLevelMenu}
            menuName="resources"
            relativeTo="resources-submenu"
            label={t("resources")}
          />
        </SecondLevelMenu>

        {/* second level menu */}
        <SecondLevelMenu
          activeMenu={activeMenu}
          menuName="platform"
          relativeTo="platform-submenu"
          label={t("platform")}
        >
          {SOLUTIONS.map(({ href, label, icon }) => (
            <SecondLevelMenuItem active={isPathActive(href)} key={href} label={tPages(label)} href={href} icon={icon} />
          ))}
        </SecondLevelMenu>

        <SecondLevelMenu
          activeMenu={activeMenu}
          menuName="use-cases"
          relativeTo="use-cases-submenu"
          label={t("useCases")}
        >
          {USE_CASES.map(({ href, label, icon }) => (
            <SecondLevelMenuItem active={isPathActive(href)} key={href} label={tPages(label)} href={href} icon={icon} />
          ))}
        </SecondLevelMenu>

        <SecondLevelMenu
          activeMenu={activeMenu}
          menuName="resources"
          relativeTo="resources-submenu"
          label={t("resources")}
        >
          {RESOURCES.map(({ href, label, icon }) => (
            <SecondLevelMenuItem active={isPathActive(href)} key={href} label={tPages(label)} href={href} icon={icon} />
          ))}
        </SecondLevelMenu>
      </ul>
    </div>
  );
};

export default MenuBody;
