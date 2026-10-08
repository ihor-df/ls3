import type { LocaleHrefs } from "@/sanity/helpers";
import { useLocale } from "next-intl";
import { LOCALES_DATA } from "../constants";
import { LangSwitcherItem } from "../lang-switcher-item";
import { MenuCategory } from "../types";
import { SecondLevelMenu } from "./components";

type LangSwitcherProps = {
  localeHrefs: LocaleHrefs;
  closeMenu: () => void;
  renderedMenu: MenuCategory | undefined;
  activeMenu: MenuCategory | undefined;
};

const LangSwitcher = ({ localeHrefs, closeMenu, renderedMenu, activeMenu }: LangSwitcherProps) => {
  const locale = useLocale();

  return (
    <SecondLevelMenu
      renderedMenu={renderedMenu}
      relativeTo="desktop-language-menu"
      menuName="language"
      activeMenu={activeMenu}
    >
      {LOCALES_DATA.map((data) => {
        return (
          <LangSwitcherItem
            key={data.code}
            {...data}
            href={localeHrefs[data.code]}
            onClick={closeMenu}
            locale={locale}
          />
        );
      })}
    </SecondLevelMenu>
  );
};

export default LangSwitcher;
