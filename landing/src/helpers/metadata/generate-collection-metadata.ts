import { routing } from "@/i18n/routing";
import { NO_INDEX_FOLLOW_ROBOTS, SITE_NAME } from "@/lib/constants";
import { generateUrl } from "@/lib/utils";
import { getLanguageNavigation } from "@/sanity/language-navigation";
import type { Metadata } from "next";
import { GenerateMetadataProps } from "./generate-page-metadata";
import { getSocialImage } from "./get-social-image";

type Props = GenerateMetadataProps & {
  type?: "website" | "article";
};

export async function generateCollectionPageMetadata({
  locale,
  pathname,
  title,
  description,
  ogImage,
  noIndex,
  type = "website",
}: Props): Promise<Metadata> {
  const navigation = await getLanguageNavigation(locale);
  const currentUrl = generateUrl(locale, pathname);
  const translatedPaths = navigation[pathname] ?? {};

  const languages: Record<string, string> = {
    [locale]: currentUrl,
    ...Object.fromEntries(
      routing.locales
        .filter((language) => translatedPaths[language])
        .map((language) => [language, generateUrl(language, translatedPaths[language]!)]),
    ),
  };

  if (languages.en) {
    languages["x-default"] = languages.en;
  }

  const socialImage = getSocialImage(ogImage);

  return {
    alternates: {
      canonical: currentUrl,
      languages,
    },
    openGraph: {
      locale,
      url: currentUrl,
      siteName: SITE_NAME,
      type,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      images: [socialImage],
    },
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(noIndex ? { robots: NO_INDEX_FOLLOW_ROBOTS } : {}),
  };
}
