"use client";

import BottomDrawer from "@/components/ui/bottom-drawer";
import useCheckScreen from "@/hooks/useCheckScreen";
import { cn } from "@/lib/utils";
import ArrowIcon from "@assets/icons/arrow.svg";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Circles, MonthButtonDesktop, MonthButtonMobile, SelectYearButton } from "./components";
import type { PeriodGroup, SelectedPeriod } from "./types";

type MonthPickerProps = {
  periods: PeriodGroup[];
  selectedPeriod: SelectedPeriod | null;
  onPeriodChange: (period: SelectedPeriod) => void;
};

const MonthPicker = ({ periods, selectedPeriod, onPeriodChange }: MonthPickerProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isMobile = useCheckScreen("(max-width: 1023px)");
  const t = useTranslations("versionHistory.periodDrawer");

  const selectedYear = periods.find((period) => period.year === selectedPeriod?.year);
  const selectedMonth = selectedYear?.months.find((month) => month.value === selectedPeriod?.month);
  const selectedLabel = selectedPeriod
    ? `${selectedPeriod.year} - ${selectedMonth?.label ?? t("allLabel")}`
    : t("allLabel");

  useEffect(() => {
    if (!isMobile) {
      setDrawerOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="bg-dark-grey lg:rounded-large h-15 max-h-max rounded-full lg:h-auto lg:p-3 lg:pr-1">
      <div className="period-scrollbar max-h-[calc(100dvh-300px)] lg:min-h-70 lg:overflow-y-auto">
        {/* Mobile menu */}
        <BottomDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          title={t("title")}
          closeLabel={t("closeLabel")}
          scrollAreaClassName="period-scrollbar"
          trigger={
            <button
              type="button"
              className="flex w-full cursor-pointer items-center p-3 pr-5 text-xl font-medium md:text-2xl lg:hidden"
            >
              <Circles className="mr-5" />
              {selectedLabel}
              <ArrowIcon className={cn("ml-auto size-4 transition-transform", drawerOpen && "rotate-180")} />
            </button>
          }
        >
          <ul className="mr-2">
            {periods.map((period) => {
              const isOpen = selectedPeriod?.year === period.year;
              const fullYear = selectedPeriod?.month === null && isOpen;
              const monthsId = `period-months-${period.year}`;

              return (
                <li key={period.year} className="group mt-5 first:mt-0">
                  <SelectYearButton
                    onClick={() => onPeriodChange({ year: period.year, month: null })}
                    variant="mobile"
                    year={period.year}
                    selectedDate={selectedPeriod}
                    quantity={period.count}
                    isOpen={isOpen}
                    iconSize="lg"
                    arrowClassName="size-6"
                    aria-controls={monthsId}
                    aria-expanded={isOpen}
                  />

                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-in-out",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="min-h-0 overflow-hidden" aria-hidden={!isOpen} inert={!isOpen}>
                      <ul id={monthsId} className="mt-2 grid grid-cols-3 gap-2 md:flex md:flex-wrap">
                        <li className="col-span-3">
                          <MonthButtonMobile
                            active={fullYear}
                            className="h-full max-md:h-13 md:text-center"
                            onClick={() => onPeriodChange({ year: period.year, month: null })}
                          >
                            {t("allLabel")}{" "}
                            <span className="font-medium text-[rgba(234,245,255,0.30)] max-md:ml-3 md:mt-1 md:block">
                              {period.count}
                            </span>
                          </MonthButtonMobile>
                        </li>

                        {period.months.map((month) => {
                          const current = selectedPeriod?.month === month.value && selectedPeriod?.year === period.year;
                          return (
                            <li key={month.value}>
                              <MonthButtonMobile
                                active={current}
                                className="px-3 py-4 text-center"
                                onClick={() => onPeriodChange({ year: period.year, month: month.value })}
                              >
                                {month.label}
                                <span className="mt-1 block font-medium text-[rgba(234,245,255,0.30)]">
                                  {month.count}
                                </span>
                              </MonthButtonMobile>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>

                  <hr className="mt-5 border-white/10 group-last:hidden" />
                </li>
              );
            })}
          </ul>
        </BottomDrawer>

        {/* Desktop menu */}
        <ul className="pr-2 max-lg:hidden">
          {periods.map((period) => (
            <li key={period.year} className="group mt-4 first:mt-0">
              <SelectYearButton
                selectedDate={selectedPeriod}
                onClick={() => onPeriodChange({ year: period.year, month: null })}
                year={period.year}
                quantity={period.count}
              />

              <ul>
                {period.months.map((month) => (
                  <li key={month.value}>
                    <MonthButtonDesktop
                      year={period.year}
                      month={month.value}
                      label={month.label}
                      amount={month.count}
                      selected={selectedPeriod}
                      onClick={() => onPeriodChange({ year: period.year, month: month.value })}
                    />
                  </li>
                ))}
              </ul>
              <hr className="mt-4 border-white/10 group-last:hidden" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MonthPicker;
