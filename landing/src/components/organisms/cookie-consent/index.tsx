"use client";

import GlassButton from "@/components/atoms/glass-button";
import Button from "@/components/atoms/main-button";
import type { CookieConsentPreferences, OptionalCookieCategory } from "@/lib/cookie-consent/types";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import Settings from "./settings";

type CookieConsentView = "notice" | "settings";

type CookieConsentModalProps = {
  initialView: CookieConsentView;
  preferences: CookieConsentPreferences;
  hasAnswered: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  onSavePreferences: (preferences: CookieConsentPreferences) => void;
  onCloseSettings: () => void;
};

export default function CookieConsentModal({
  initialView,
  preferences,
  hasAnswered,
  acceptAll,
  onSavePreferences,
  onCloseSettings,
  rejectAll,
}: CookieConsentModalProps) {
  const t = useTranslations("cookieConsent.notice");
  const modalRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<CookieConsentView>(initialView);
  const [draftPreferences, setDraftPreferences] = useState(preferences);

  const updateDraftPreference = (key: OptionalCookieCategory, value: boolean) => {
    setDraftPreferences((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const closeSettings = () => {
    setDraftPreferences(preferences);
    if (hasAnswered) {
      onCloseSettings();
      return;
    }
    setView("notice");
  };

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const handleModalWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const scrollableContent = modal.querySelector<HTMLElement>("[data-cookie-consent-scroll]");
      if (!scrollableContent) return;
      scrollableContent.scrollTop += event.deltaY;
    };

    modal.addEventListener("wheel", handleModalWheel, { passive: false });

    return () => {
      modal.removeEventListener("wheel", handleModalWheel);
    };
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-80 flex items-end justify-center p-3 md:p-10",
        view === "settings" && "items-center",
      )}
    >
      <motion.div
        layout
        ref={modalRef}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "bg-dark-grey/30 pointer-events-auto relative flex max-h-[calc(100dvh-1.5rem)] w-full flex-col overflow-hidden overscroll-contain rounded-3xl border border-white/20 backdrop-blur-3xl md:max-h-[calc(100dvh-3rem)] md:max-w-3xl",
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={view}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={cn("w-full", view === "settings" && "flex min-h-0 flex-1 flex-col")}
          >
            {view === "notice" ? (
              <section
                className="p-5 text-center lg:p-6"
                role="dialog"
                aria-labelledby="cookie-consent-title"
                aria-describedby="cookie-consent-description"
              >
                <h2 className="text-3xl tracking-[-0.52px] uppercase" id="cookie-consent-title">
                  {t("title")}
                </h2>
                <p
                  id="cookie-consent-description"
                  className="mx-auto mt-5 text-sm leading-[1.1] tracking-[-0.42px] uppercase md:text-base lg:mt-7"
                >
                  {t("description")}
                </p>

                <div className="mt-5 flex items-center justify-between gap-5 md:justify-center lg:mt-7">
                  <GlassButton
                    buttonProps={{
                      onClick: () => setView("settings"),
                    }}
                    size="small"
                    className="uppercase"
                  >
                    {t("settings")}
                  </GlassButton>

                  <Button size="small" onClick={acceptAll} className="uppercase">
                    {t("acceptAll")}
                  </Button>
                </div>
              </section>
            ) : (
              <Settings
                closeSettings={closeSettings}
                draftPreferences={draftPreferences}
                updateDraftPreference={updateDraftPreference}
                onSavePreferences={onSavePreferences}
                rejectAll={rejectAll}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
