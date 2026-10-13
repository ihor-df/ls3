import { routing } from "@/i18n/routing";
import { generateUrl } from "@/lib/utils";
import { imageBuilder } from "@/sanity/helpers";
import type { Seo } from "@/sanity/sanity.types";
import type { Metadata } from "next";
import { Locale } from "next-intl";

export async function generatePageMetadata({
  locale,
  pathname,
  title,
  description,
  pageLocales,
  ogImage,
}: {
  locale: Locale;
  pathname: string;
  title?: string;
  description?: string;
  pageLocales?: Locale[];
  ogImage?: Seo["ogImage"] | null;
}): Promise<Metadata> {
  const locales = pageLocales ? pageLocales : routing.locales;
  const canonical = generateUrl(locale, pathname);

  const alternateLinks = locales.map((loc) => ({
    hrefLang: loc,
    href: generateUrl(loc, pathname),
  }));

  const languages = Object.fromEntries(alternateLinks.map((l) => [l.hrefLang, l.href]));
  languages["x-default"] = languages["en"];

  const imageUrl = ogImage?.asset ? imageBuilder(ogImage)?.width(1200).height(630).fit("crop").url() : undefined;
  const socialImage = imageUrl ? { url: imageUrl, width: 1200, height: 630 } : null;

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: {
      canonical,
      languages,
    },
    ...(socialImage
      ? {
          openGraph: {
            siteName: "Linken Sphere",
            locale,
            type: "website",
            images: [socialImage],
          },
          twitter: {
            card: "summary",
            images: [socialImage],
          },
        }
      : {}),
  };
}
