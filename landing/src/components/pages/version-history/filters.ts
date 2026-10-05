import type { Locale } from "next-intl";
import type { SelectedPeriod, VersionHistoryItem } from "./types";

type VersionFilters = {
  locale: Locale;
  period: SelectedPeriod | null;
  search: string;
};

const normalizeSearchValue = (value: string, locale: Locale) =>
  value.normalize("NFKC").trim().toLocaleLowerCase(locale);

export const filterVersions = (versions: VersionHistoryItem[], { locale, period, search }: VersionFilters) => {
  const searchTerms = normalizeSearchValue(search, locale).split(/\s+/).filter(Boolean);

  return versions.filter((version) => {
    const matchesPeriod =
      !period ||
      (version.releaseYear === period.year && (period.month === null || version.releaseMonth === period.month));

    if (!matchesPeriod || !searchTerms.length) return matchesPeriod;

    const searchableText = normalizeSearchValue(`${version.version} ${version.searchText}`, locale);

    return searchTerms.every((term) => searchableText.includes(term));
  });
};
