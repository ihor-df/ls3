import Button from "@/components/atoms/main-button";
import type { CookieConsentPreferences, OptionalCookieCategory } from "@/lib/cookie-consent/types";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { CategoryCard, Toggle } from "./components";

type SettingsProps = {
  closeSettings: () => void;
  draftPreferences: CookieConsentPreferences;
  updateDraftPreference: (key: OptionalCookieCategory, value: boolean) => void;
  onSavePreferences: (preferences: CookieConsentPreferences) => void;
  rejectAll: () => void;
};

const Settings = ({
  closeSettings,
  draftPreferences,
  updateDraftPreference,
  onSavePreferences,
  rejectAll,
}: SettingsProps) => {
  const t = useTranslations("cookieConsent.settings");

  return (
    <section
      role="dialog"
      aria-labelledby="cookie-settings-title"
      aria-describedby="cookie-settings-description"
      className="flex min-h-0 w-full flex-1 flex-col leading-none"
    >
      <div className="flex min-h-0 flex-1 flex-col py-7 pb-0 pl-5 lg:pl-6">
        <h2 id="cookie-settings-title" className="text-2xl leading-none md:text-3xl xl:text-4xl">
          {t("title")}
        </h2>

        <p id="cookie-settings-description" className="mt-5 max-w-9/10 leading-[1.1] text-white/90 lg:text-lg">
          {t("description")}
        </p>

        <button
          type="button"
          aria-label={t("close")}
          onClick={closeSettings}
          className="absolute top-3 right-3 flex shrink-0 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-white lg:top-7 lg:right-7"
        >
          <X className="size-7 md:size-9" aria-hidden="true" />
        </button>

        <div
          data-cookie-consent-scroll
          className="custom-scrollbar mt-7 min-h-0 flex-1 overflow-auto overscroll-contain pr-4 pb-5 lg:mt-10 lg:pr-5 2xl:pr-7"
        >
          <ul className="flex flex-col gap-5">
            <CategoryCard
              className="flex-col lg:flex-row"
              title={t("essential.title")}
              description={t("essential.description")}
            >
              <span className="border-accent-orange/50 text-accent-orange flex h-11 w-full items-center justify-center rounded-full border-2 text-sm text-nowrap uppercase md:h-13 lg:w-auto lg:px-10">
                {t("essential.alwaysOn")}
              </span>
            </CategoryCard>

            <hr className="h-[1.5px] border-white/20" />

            {(["functional", "analytics", "advertising"] as const).map((category) => (
              <CategoryCard key={category} title={t(`${category}.title`)} description={t(`${category}.description`)}>
                <Toggle
                  label={t(`${category}.title`)}
                  checked={draftPreferences[category]}
                  onChange={(checked) => updateDraftPreference(category, checked)}
                />
              </CategoryCard>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-5 p-5 max-lg:border-t-[1.5px] max-lg:border-white/20 md:justify-end lg:p-7">
        <Button variant="secondary" onClick={rejectAll} size="small" className="uppercase">
          {t("rejectAll")}
        </Button>

        <Button size="small" onClick={() => onSavePreferences(draftPreferences)} className="min-w-45 uppercase">
          {t("accept")}
        </Button>
      </div>
    </section>
  );
};

export default Settings;
