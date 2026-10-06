"use client";

import type { Locale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { filterVersions } from "./helpers";
import MonthPicker from "./month-picker";
import type { PeriodGroup, SelectedPeriod, VersionHistoryItem } from "./types";
import VersionCard from "./version-card";

type VersionHistoryContentProps = {
  locale: Locale;
  noResults: string;
  versions: VersionHistoryItem[];
  periods: PeriodGroup[];
};

type VersionHistoryFilters = {
  search: string;
  period: SelectedPeriod | null;
};

const getDefaultPeriod = (periods: PeriodGroup[]): SelectedPeriod | null => {
  const latestPeriod = periods[0];

  return latestPeriod ? { year: latestPeriod.year, month: null } : null;
};

const getPeriodFromParams = (
  periods: PeriodGroup[],
  yearParam: string | null,
  monthParam: string | null,
): SelectedPeriod | null => {
  const year = Number(yearParam);
  const selectedYear = periods.find((period) => period.year === year);

  if (!selectedYear) return getDefaultPeriod(periods);

  if (!monthParam) return { year: selectedYear.year, month: null };

  const month = Number(monthParam);
  const selectedMonth = selectedYear.months.find((item) => item.value === month);

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

const VersionHistoryContent = ({ locale, noResults, versions, periods }: VersionHistoryContentProps) => {
  const [filters, setFilters] = useState<VersionHistoryFilters>(() => ({
    search: "",
    period: getDefaultPeriod(periods),
  }));

  const filteredVersions = filterVersions(versions, { locale, ...filters });

  const handlePeriodChange = (period: SelectedPeriod) => {
    setFilters({ search: "", period });
    updatePeriodSearchParams(period);
  };

  return (
    <>
      {/* Only URL synchronization waits for hydration; version cards stay in the prerendered HTML. */}
      <Suspense fallback={null}>
        <VersionHistoryUrlSync periods={periods} onFiltersChange={setFilters} />
      </Suspense>

      <div className="mt-10 grid flex-1 grid-cols-1 gap-10 lg:grid-cols-[300px_1fr]">
        <MonthPicker periods={periods} selectedPeriod={filters.period} onPeriodChange={handlePeriodChange} />

        {filteredVersions.length ? (
          <ul>
            {filteredVersions.map((version) => (
              <VersionCard
                releaseType={version.releaseType}
                key={version._id}
                version={version.version}
                imageUrl={version.imageUrl}
                imageAlt={version.imageAlt}
                body={version.body}
                releaseDate={version.formattedReleaseDate}
              />
            ))}
          </ul>
        ) : (
          <p className="text-light-grey flex min-h-40 items-center justify-center text-center" role="status">
            {noResults}
          </p>
        )}
      </div>
    </>
  );
};

export default VersionHistoryContent;
