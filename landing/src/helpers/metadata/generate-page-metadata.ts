import { routing } from "@/i18n/routing";
import { NO_INDEX_FOLLOW_ROBOTS, SITE_NAME } from "@/lib/constants";
import { generateUrl } from "@/lib/utils";
import type { Seo } from "@/sanity/sanity.types";
import type { Metadata } from "next";
import { Locale } from "next-intl";
import { getSocialImage } from "./get-social-image";

export async function generatePageMetadata({
  locale,
  pathname,
  title,
  description,
  pageLocales,
  ogImage,
  noIndex,
}: {
  locale: Locale;
  pathname: string;
  title?: string | null;
  description?: string | null;
  pageLocales?: Locale[];
  ogImage?: Seo["ogImage"] | null;
  noIndex?: boolean;
}): Promise<Metadata> {
  const locales = pageLocales ? pageLocales : routing.locales;
  const currentUrl = generateUrl(locale, pathname);

  const alternateLinks = locales.map((loc) => ({
    hrefLang: loc,
    href: generateUrl(loc, pathname),
  }));

  const languages = Object.fromEntries(alternateLinks.map((l) => [l.hrefLang, l.href]));
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
      siteName: SITE_NAME,
      locale,
      type: "website",
      images: [socialImage],
      url: currentUrl,
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
