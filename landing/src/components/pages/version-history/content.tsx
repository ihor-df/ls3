"use client";

import { cn } from "@/lib/utils";
import type { Locale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type ReactNode } from "react";
import { filterVersions } from "./helpers";
import MonthPicker from "./month-picker";
import type { PeriodGroup, SelectedPeriod, VersionHistoryItem } from "./types";
import VersionCard from "./version-card";

type VersionHistoryContentProps = {
  header: ReactNode;
  locale: Locale;
  noResults: string;
  versions: VersionHistoryItem[];
  periods: PeriodGroup[];
};

type VersionHistoryFilters = {
  search: string;
  period: SelectedPeriod | null;
};

const resultsClassName = "lg:col-start-2 lg:row-start-1 lg:pt-65 lg:pb-40";

const getDefaultPeriod = (periods: PeriodGroup[]): SelectedPeriod | null => {
  const latestPeriod = periods[0];

  return latestPeriod ? { year: latestPeriod.year, month: null } : null;
};

const getPeriodFromParams = (
  periods: PeriodGroup[],
  yearParam: string | null,
  monthParam: string | null,
): SelectedPeriod | null => {
  const selectedYear = periods.find((period) => period.year === Number(yearParam));

  if (!selectedYear) return getDefaultPeriod(periods);

  const selectedMonth = selectedYear.months.find((item) => item.value === Number(monthParam));

  return {
    year: selectedYear.year,
    month: selectedMonth?.value ?? null,
  };
};

const VersionHistoryUrlSync = ({
  periods,
  onFiltersChange,
}: {
  periods: PeriodGroup[];
  onFiltersChange: (filters: VersionHistoryFilters) => void;
}) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("q") ?? "";
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  useEffect(() => {
    const period = search ? null : getPeriodFromParams(periods, year, month);
    onFiltersChange({ search, period });
  }, [month, onFiltersChange, periods, search, year]);

  return null;
};

const updatePeriodSearchParams = (period: SelectedPeriod) => {
  const url = new URL(window.location.href);

  url.searchParams.delete("q");
  url.searchParams.set("year", String(period.year));

  if (period.month === null) {
    url.searchParams.delete("month");
  } else {
    url.searchParams.set("month", String(period.month));
  }

  window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
};

const VersionHistoryContent = ({ header, locale, noResults, versions, periods }: VersionHistoryContentProps) => {
  const initialPeriod = getDefaultPeriod(periods);
  const [filters, setFilters] = useState<VersionHistoryFilters>(() => ({
    search: "",
    period: initialPeriod,
  }));

  const filteredVersions = filterVersions(versions, { locale, ...filters });

  const handlePeriodChange = (period: SelectedPeriod) => {
    setFilters({ search: "", period });
    updatePeriodSearchParams(period);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <>
      {/* Only URL synchronization waits for hydration; version cards stay in the prerendered HTML. */}
      <Suspense fallback={null}>
        <VersionHistoryUrlSync periods={periods} onFiltersChange={setFilters} />
      </Suspense>

      <div className="grid flex-1 grid-cols-1 gap-10 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* A viewport-sized layer makes all controls leave together when the footer enters the screen. */}
        <div className="lg:pointer-events-none lg:sticky lg:top-0 lg:z-20 lg:col-span-full lg:row-start-1 lg:h-dvh lg:self-start">
          {header}

          <div className="mt-10 lg:pointer-events-auto lg:mt-0 lg:w-75">
            <MonthPicker
              periods={periods}
              selectedPeriod={filters.period}
              initialPeriod={initialPeriod}
              onPeriodChange={handlePeriodChange}
            />
          </div>
        </div>

        {filteredVersions.length ? (
          <ul className={resultsClassName}>
            {filteredVersions.map((version) => (
              <VersionCard key={version._id} item={version} />
            ))}
          </ul>
        ) : (
          <p
            className={cn(resultsClassName, "text-light-grey flex min-h-40 items-center justify-center text-center")}
            role="status"
          >
            {noResults}
          </p>
        )}
      </div>
    </>
  );
};

export default VersionHistoryContent;
