import ButtonRounded from "@/components/atoms/button-rounded";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import Menu from "@assets/icons/menu.svg";
import logo from "@public/images/logo-sm@2x.png";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { MenuCategory, MobileSlide } from "../types";

type NavigationMobileProps = {};

const NavigationMobile = ({}: NavigationMobileProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MobileSlide>("root");

  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const tPages = useTranslations("navigation.pages");

  const openMobileMenu = () => {
    setActiveMenu("root");
    setIsMenuOpen(true);
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  const openMobileSlide = (category: MenuCategory) => {
    setActiveMenu(category);
  };

  const openSubmenu = (menu: MenuCategory) => {
    setActiveMenu(menu);
  };

  const goBack = () => {
    setActiveMenu("root");
  };

  //   Если при закрытии drawer нельзя сразу возвращать корневой слайд, сбрасывай его после завершения анимации:
  const handleMobileMenuTransitionEnd = (event: React.TransitionEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;
    if (!isMenuOpen) {
      setActiveMenu("root");
    }
  };

  return (
    <nav
      aria-label={t("mainNavigation")}
      className={cn(
        "glass-border pointer-events-auto h-16 w-full rounded-full bg-white/10 p-2 backdrop-blur-xl lg:hidden",
      )}
    >
      <div className="flex items-center justify-between">
        <ButtonRounded
          className="size-12 font-bold uppercase"
          buttonProps={{
            "aria-expanded": activeMenu === "language",
            "aria-label": t("changeLanguage", { language: locale.toUpperCase() }),
            "aria-controls": "language-submenu",
            onClick: () => openSubmenu("language"),
          }}
        >
          {locale}
        </ButtonRounded>

        <Link
          className="max-h-max"
          href="/"
          aria-label={tPages("homepage")}
          aria-current={pathname === "/" ? "page" : undefined}
        >
          <Image src={logo} alt="Linken Sphere logo" className="h-auto w-14 scale-[1.2] rounded-full duration-300" />
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

      {/* menu body */}
      <div
        id="mobile-menu"
        inert={!isMenuOpen}
        aria-hidden={!isMenuOpen}
        onTransitionEnd={handleMobileMenuTransitionEnd}
      >
        {/* слайды */}
      </div>
    </nav>
  );
};

export default NavigationMobile;
