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
  const normalizedSearch = normalizeSearchValue(search, locale);

  if (normalizedSearch) {
    const searchTerms = normalizedSearch.split(/\s+/);

    return versions.filter((version) => {
      const searchableText = normalizeSearchValue(`${version.version} ${version.searchText}`, locale);
      return searchTerms.every((term) => searchableText.includes(term));
    });
  }

  if (!period) return versions;

  return versions.filter(
    (version) =>
      version.releaseYear === period.year && (period.month === null || version.releaseMonth === period.month),
  );
};
