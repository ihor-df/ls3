import { Locale } from "next-intl";

export type LocaleParams = Promise<{ locale: Locale }>;

export type LocaleSlugParams = Promise<{ locale: Locale; slug: string }>;
