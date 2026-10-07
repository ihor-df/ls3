import { formatDate } from "@/lib/utils";
import { imageBuilder } from "@/sanity/helpers";
import type { VERSION_HISTORY_QUERY_RESULT } from "@/sanity/sanity.types";
import type { Locale } from "next-intl";
import type { PeriodGroup, VersionHistoryItem } from "./types";

const parseReleasePeriod = (releaseDate: string) => {
  const [year, month] = releaseDate.split("-").map(Number);

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error(`Invalid version release date: ${releaseDate}`);
  }

  return { year, month };
};

const capitalizeMonth = (month: string, locale: Locale) =>
  `${month.charAt(0).toLocaleUpperCase(locale)}${month.slice(1)}`;

export const buildVersionHistoryData = (
  versions: VERSION_HISTORY_QUERY_RESULT["versions"],
  locale: Locale,
): { versions: VersionHistoryItem[]; periods: PeriodGroup[] } => {
  const countsByYear = new Map<number, Map<number, number>>();
  const monthFormatter = new Intl.DateTimeFormat(locale, {
    month: "long",
    timeZone: "UTC",
  });

  const preparedVersions = versions.map((version) => {
    const { year, month } = parseReleasePeriod(version.releaseDate);
    const months = countsByYear.get(year) ?? new Map<number, number>();

    months.set(month, (months.get(month) ?? 0) + 1);
    countsByYear.set(year, months);

    return {
      _id: version._id,
      body: version.body,
      releaseType: version.releaseType,
      searchText: version.searchText,
      version: version.version,
      releaseDate: version.releaseDate,
      formattedReleaseDate: formatDate(version.releaseDate, locale, { month: "long" }),
      releaseYear: year,
      releaseMonth: month,
      imageUrl: imageBuilder(version.cover)?.url() ?? null,
      imageAlt: version.cover.alt,
    };
  });

  const periods = [...countsByYear.entries()]
    .sort(([yearA], [yearB]) => yearB - yearA)
    .map(([year, months]) => {
      const periodMonths = [...months.entries()]
        .sort(([monthA], [monthB]) => monthB - monthA)
        .map(([month, count]) => ({
          value: month,
          label: capitalizeMonth(monthFormatter.format(new Date(Date.UTC(2000, month - 1, 1))), locale),
          count,
        }));

      return {
        year,
        count: periodMonths.reduce((total, month) => total + month.count, 0),
        months: periodMonths,
      };
    });

  return { versions: preparedVersions, periods };
};
