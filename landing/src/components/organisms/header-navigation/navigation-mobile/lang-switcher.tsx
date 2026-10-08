import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { LOCALES_DATA } from "../constants";
import { LangSwitcherItem } from "../lang-switcher-item";
import { CloseButton } from "./components";

type LangSwitcherProps = {
  isLangMenuOpen: boolean;
  closeLangMenu: () => void;
  changeLocale: (locale: string) => void;
};

const LangSwitcher = ({ isLangMenuOpen, closeLangMenu, changeLocale }: LangSwitcherProps) => {
  const t = useTranslations("navigation");
  const locale = useLocale();

  const handleLocaleChange = (locale: string) => {
    changeLocale(locale);
    closeLangMenu();
  };

  return (
    <div
      id="mobile-language-menu"
      inert={!isLangMenuOpen}

      className={cn(
        "fixed top-0 left-0 z-20 flex h-dvh w-62 flex-col backdrop-blur-2xl transition-transform duration-300",
        isLangMenuOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex shrink-0 items-center justify-between p-7 pb-5">
        <CloseButton ariaLabel={t("closeMenu")} onClick={closeLangMenu} />
      </div>

      <ul className="custom-scrollbar overflow-auto px-5 pt-10 pb-20">
        {LOCALES_DATA.map((data) => {
          return (
            <LangSwitcherItem
              key={data.code}
              {...data}
              className="text-xl"
              changeLocale={handleLocaleChange}
              locale={locale}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default LangSwitcher;
