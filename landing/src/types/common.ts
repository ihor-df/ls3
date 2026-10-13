import { Locale } from "next-intl";

export type LocaleParams = Promise<{ locale: Locale }>;
export type LocaleSlugParams = Promise<{ locale: Locale; slug: string }>;

export type LocalePageProps = {
  params: LocaleParams;
};
export type LocaleSlugPageProps = {
  params: LocaleSlugParams;
};

export type Categories = { _id: string; title: string | null; slug?: string }[];
