import { routing } from "@/i18n/routing";
import { NO_INDEX_FOLLOW_ROBOTS, SITE_NAME } from "@/lib/constants";
import { generateUrl } from "@/lib/utils";
import { getLanguageNavigation } from "@/sanity/language-navigation";
import type { Seo } from "@/sanity/sanity.types";
import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getSocialImage } from "./get-social-image";

export async function generateCollectionMetadata({
  locale,
  pathname,
  title,
  description,
  ogImage,
  noIndex,
  type = "website",
}: {
  locale: Locale;
  pathname: string;
  title?: string | null;
  description?: string | null;
  ogImage?: Seo["ogImage"] | null;
  noIndex?: boolean;
  type?: "website" | "article";
}): Promise<Metadata> {
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
