import { routing } from "@/i18n/routing";
import { getPaginationPath } from "@/lib/pagination";
import { getLanguageNavigation } from "@/sanity/language-navigation";
import type { Metadata } from "next";
import { GenerateMetadataProps, generatePageMetadata } from "./generate-page-metadata";

type Props = GenerateMetadataProps & {
  page: number;
};

export async function generatePaginationPageMetadata({
  locale,
  pathname,
  page,
  pageLocales,
  title,
  description,
  ogImage,
  noIndex,
}: Props): Promise<Metadata> {
  const pagePath = getPaginationPath(pathname, page);
  const navigation = await getLanguageNavigation(locale);
  const availableLocales = (pageLocales ?? routing.locales).filter((language) => navigation[pagePath]?.[language]);

  return generatePageMetadata({
    locale,
    pathname: pagePath,
    pageLocales: availableLocales,
    title,
    description,
    ogImage,
    noIndex,
  });
}
