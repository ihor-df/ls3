"use client";

import type { Locale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { filterVersions } from "./filters";
import MonthPicker from "./month-picker";
import type { PeriodGroup, SelectedPeriod, VersionHistoryItem } from "./types";
import VersionCard from "./version-card";

type VersionHistoryContentProps = {
  locale: Locale;
  noResults: string;
  versions: VersionHistoryItem[];
  periods: PeriodGroup[];
};

const getDefaultPeriod = (periods: PeriodGroup[]): SelectedPeriod | null => {
  const latestPeriod = periods[0];

  return latestPeriod ? { year: latestPeriod.year, month: null } : null;
};

const getPeriodFromSearchParams = (periods: PeriodGroup[]): SelectedPeriod | null => {
  const params = new URLSearchParams(window.location.search);
  const year = Number(params.get("year"));
  const selectedYear = periods.find((period) => period.year === year);

  if (!selectedYear) return getDefaultPeriod(periods);

  const monthParam = params.get("month");
  if (!monthParam) return { year: selectedYear.year, month: null };

  const month = Number(monthParam);
  const selectedMonth = selectedYear.months.find((item) => item.value === month);

  return {
    year: selectedYear.year,
    month: selectedMonth?.value ?? null,
  };
};

const updatePeriodSearchParams = (period: SelectedPeriod | null) => {
  const url = new URL(window.location.href);

  if (period) {
    url.searchParams.set("year", String(period.year));

    if (period.month === null) {
      url.searchParams.delete("month");
    } else {
      url.searchParams.set("month", String(period.month));
    }
  } else {
    url.searchParams.delete("year");
    url.searchParams.delete("month");
  }

  window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
};

const VersionHistoryContent = ({ locale, noResults, versions, periods }: VersionHistoryContentProps) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("q") ?? "";
  const [selectedPeriod, setSelectedPeriod] = useState<SelectedPeriod | null>(() => getDefaultPeriod(periods));

  useEffect(() => {
    const syncPeriodWithUrl = () => setSelectedPeriod(getPeriodFromSearchParams(periods));

    syncPeriodWithUrl();
    window.addEventListener("popstate", syncPeriodWithUrl);

    return () => window.removeEventListener("popstate", syncPeriodWithUrl);
  }, [periods]);

  const filteredVersions = useMemo(
    () => filterVersions(versions, { locale, period: selectedPeriod, search }),
    [locale, search, selectedPeriod, versions],
  );

  const handlePeriodChange = (period: SelectedPeriod) => {
    setSelectedPeriod(period);
    updatePeriodSearchParams(period);
  };

  return (
    <div className="mt-10 grid flex-1 grid-cols-1 gap-10 lg:grid-cols-[300px_1fr]">
      <MonthPicker periods={periods} selectedPeriod={selectedPeriod} onPeriodChange={handlePeriodChange} />

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
  );
};

export default VersionHistoryContent;
