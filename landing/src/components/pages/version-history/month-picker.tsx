"use client";

import { cn } from "@/lib/utils";
import Circles from "@assets/icons/circles.svg";
import { useState } from "react";

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
];

type Selected = { year: number; month: string };

const MonthItem = ({
  month,
  amount,
  year,
  handleMonthClick,
  selected,
}: {
  month: string;
  amount: number;
  year: number;
  handleMonthClick: ({ year, month }: Selected) => void;
  selected: Selected | null;
}) => {
  const active = selected?.month === month && selected.year === year;
  return (
    <li
      className={cn(
        "hover:bg-sidebar-hover flex items-center justify-between rounded-full px-5 py-4",
        active && "bg-sidebar-hover",
      )}
      onClick={() => handleMonthClick({ year, month })}
    >
      <span className={cn("text-xl font-bold text-white/60", active && "text-white")}>{month}</span>{" "}
      <span className="tracking-[-0.01em] text-[#EAF5FF]/30">{amount}</span>
    </li>
  );
};

const MonthPicker = ({}: MonthPickerProps) => {
  const [selected, setSelected] = useState<Selected | null>(null);

  const handleMonthClick = ({ year, month }: Selected) => {
    setSelected({ year, month });
  };

  return (
    <div className="bg-dark-grey lg:rounded-large max-h-[calc(100dvh-300px)] overflow-y-auto rounded-full p-3 pr-4 lg:pr-1.5">
      <ul>
        {years.map((y) => (
          <li key={y.year} className="group mt-4 first:mt-0">
            <div className="flex items-center px-5 py-4">
              <div className="flex size-9 items-center justify-center rounded-full bg-white/10">
                <Circles className="size-6" />
              </div>

              <span className="ml-4 text-2xl">{y.year}</span>
              <span className="ml-auto tracking-[-0.01em] text-[#EAF5FF]/30">
                {y.months.reduce((acc, val) => acc + val.month.length, 0)}
              </span>
            </div>

            <ul>
              {y.months.map((m) => (
                <MonthItem
                  handleMonthClick={handleMonthClick}
                  key={m.month}
                  year={y.year}
                  month={m.month}
                  amount={m.amount}
                  selected={selected}
                />
              ))}
            </ul>
            <hr className="mt-4 border-white/10 group-last:hidden" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MonthPicker;
