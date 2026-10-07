import type { PARTNERS_QUERY_RESULT } from "@/sanity/sanity.types";

export type PartnersSearchResult = {
  partners: PARTNERS_QUERY_RESULT;
  total: number;
  pageCount: number;
};
