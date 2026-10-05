import type { VERSION_HISTORY_QUERY_RESULT } from "@/sanity/sanity.types";

type VersionSource = VERSION_HISTORY_QUERY_RESULT["versions"][number];

export type SelectedPeriod = {
  year: number;
  month: number | null;
};

export type PeriodMonth = {
  value: number;
  label: string;
  count: number;
};

export type PeriodGroup = {
  year: number;
  count: number;
  months: PeriodMonth[];
};

export type VersionHistoryItem = Pick<VersionSource, "_id" | "body" | "releaseType" | "searchText" | "version"> & {
  releaseDate: string;
  formattedReleaseDate: string;
  releaseYear: number;
  releaseMonth: number;
  imageUrl: string | null;
  imageAlt: string;
};
