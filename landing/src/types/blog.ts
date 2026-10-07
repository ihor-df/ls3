import type { ARTICLES_QUERY_RESULT } from "@/sanity/sanity.types";
import type { Categories } from "./common";

export type BlogPostPreview = {
  id: string;
  title: string;
  href: string;
  imageSrc: string;
  alt: string;
  categories: Categories;
};

export type BlogSearchResult = {
  posts: ARTICLES_QUERY_RESULT;
  total: number;
  pageCount: number;
};
