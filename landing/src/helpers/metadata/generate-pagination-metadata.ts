import { NO_INDEX_FOLLOW_ROBOTS, SITE_NAME } from "@/lib/constants";
import { getPaginationPath } from "@/lib/pagination";
import { generateUrl } from "@/lib/utils";
import type { Seo } from "@/sanity/sanity.types";
import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getSocialImage } from "./get-social-image";

export async function generatePaginationPageMetadata({
  locale,
  pathname,
  page,
  title,
  description,
  ogImage,
  noIndex,
}: {
  locale: Locale;
  pathname: string;
  page: number;
  title?: string | null;
  description?: string | null;
  ogImage?: Seo["ogImage"] | null;
  noIndex?: boolean;
}): Promise<Metadata> {
  const currentUrl = generateUrl(locale, getPaginationPath(pathname, page));
  const socialImage = getSocialImage(ogImage);

  return {
    alternates: {
      canonical: currentUrl,
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
