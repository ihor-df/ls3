"use client";

import BottomDrawer from "@/components/ui/bottom-drawer";
import { cn } from "@/lib/utils";
import ArrowIcon from "@assets/icons/arrow.svg";
import { useState } from "react";

import { useTranslations } from "next-intl";
import { Circles, MonthButtonDesktop, MonthButtonMobile, SelectedDate, SelectYearButton } from "./components";

type MonthPickerProps = {};

const years = [
  {
    year: 2026,
    months: [
      {
        month: "April",
        amount: 2,
      },
      {
        month: "March",
        amount: 4,
      },
      {
        month: "February",
        amount: 3,
      },
    ],
  },
  {
    year: 2025,
    months: [
      {
        month: "December",
        amount: 6,
      },
      {
        month: "September",
        amount: 4,
      },
      {
        month: "June",
        amount: 3,
      },
    ],
  },
  {
    year: 2024,
    months: [
      {
        month: "November",
        amount: 2,
      },
      {
        month: "July",
        amount: 4,
      },
      {
        month: "June",
        amount: 3,
      },
    ],
  },
];

const MonthPicker = ({}: MonthPickerProps) => {
  const t = useTranslations("versionHistory.periodDrawer");

  const [selectedDate, setSelectedDate] = useState<SelectedDate | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const changeDate = ({ year, month }: SelectedDate) => {
    setSelectedDate({ year, month });
  };

  return (
    <div className="bg-dark-grey lg:rounded-large h-15 max-h-[calc(100dvh-300px)] overflow-y-auto rounded-full p-3 pr-5 lg:h-auto lg:pr-0.5">
      {/* Mobile menu */}
      <BottomDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title={t("title")}
        closeLabel={t("closeLabel")}
        trigger={
          <button type="button" className="flex w-full items-center text-2xl font-medium lg:hidden">
            <Circles className="mr-5" />
            {selectedDate?.year} - {selectedDate?.month ? selectedDate.month : "All"}
            <ArrowIcon className={cn("ml-auto size-4 transition-transform", drawerOpen && "rotate-180")} />
          </button>
        }
      >
        <ul className="mr-2">
          {years.map((y) => {
            const total = y.months.reduce((acc, val) => acc + val.month.length, 0);
            const isOpen = selectedDate?.year === y.year;
            const fullYear = selectedDate?.month === null && isOpen;

            return (
              <li key={y.year} className="group mt-5 first:mt-0">
                <SelectYearButton
                  onClick={() => changeDate({ year: y.year, month: null })}
                  variant="mobile"
                  year={y.year}
                  selectedDate={selectedDate}
                  quantity={total}
                  isOpen={selectedDate?.year === y.year}
                  iconSize="lg"
                  arrowClassName="size-6"
                />

                <ul
                  className={cn(
                    "mt-2 grid h-0 grid-cols-3 gap-2 overflow-hidden md:flex md:flex-wrap",
                    isOpen && "h-auto",
                  )}
                >
                  <li className="col-span-3">
                    <MonthButtonMobile active={fullYear} className="h-full max-md:h-13 md:text-center">
                      All{" "}
                      <span className="font-medium text-[rgba(234,245,255,0.30)] max-md:ml-3 md:mt-1 md:block">
                        {total}
                      </span>
                    </MonthButtonMobile>
                  </li>

                  {y.months.map((m) => {
                    const current = selectedDate?.month === m.month && selectedDate?.year === y.year;
                    return (
                      <li key={m.month}>
                        <MonthButtonMobile active={current} className="px-3 py-4 text-center">
                          {m.month}
                          <span className="mt-1 block font-medium text-[rgba(234,245,255,0.30)]">{m.amount}</span>
                        </MonthButtonMobile>
                      </li>
                    );
                  })}
                </ul>

                <hr className="mt-5 border-white/10 group-last:hidden" />
              </li>
            );
          })}
        </ul>
      </BottomDrawer>

      {/* Desktop menu */}
      <ul className="pr-2 max-lg:hidden">
        {years.map((y) => {
          const total = y.months.reduce((acc, val) => acc + val.month.length, 0);

          return (
            <li key={y.year} className="group mt-4 first:mt-0">
              <SelectYearButton
                selectedDate={selectedDate}
                onClick={() => changeDate({ year: y.year, month: null })}
                year={y.year}
                quantity={total}
              />

              <ul>
                {y.months.map((m) => (
                  <li key={m.month}>
                    <MonthButtonDesktop
                      year={y.year}
                      month={m.month}
                      amount={m.amount}
                      selected={selectedDate}
                      onClick={() => changeDate({ year: y.year, month: m.month })}
                    />
                  </li>
                ))}
              </ul>
              <hr className="mt-4 border-white/10 group-last:hidden" />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MonthPicker;
