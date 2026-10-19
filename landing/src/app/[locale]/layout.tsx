import Header from "@/components/organisms/header-navigation";
import ContextProviders from "@/context/context-providers";
import { DEFAULT_OG_IMAGE_URL, NO_INDEX_NO_FOLLOW_ROBOTS, SITE_NAME } from "@/lib/constants";
import { abcDiatype } from "@/lib/fonts";
import { isProductionDomain } from "@/lib/utils";
import { SITE_SETTINGS_QUERY } from "./api";

import { sanityTags } from "@/sanity/cache-tags";
import { sanityFetch } from "@/sanity/client";
import { getLanguageNavigation } from "@/sanity/language-navigation";
import type { SITE_SETTINGS_QUERY_RESULT } from "@/sanity/sanity.types";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";

import "../globals.css";

type RootLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Pick<RootLayoutProps, "params">): Promise<Metadata> {
  const { locale } = await params;

  const [t, siteSettings] = await Promise.all([
    getTranslations({ locale, namespace: "metadata" }),
    sanityFetch<SITE_SETTINGS_QUERY_RESULT>({
      query: SITE_SETTINGS_QUERY,
      params: { locale },
      tags: [sanityTags.siteSettings],
    }),
  ]);

  const title = siteSettings?.title || t("title");
  const description = siteSettings?.description || t("description");

  const socialImage = {
    url: DEFAULT_OG_IMAGE_URL,
    alt: "Linken Sphere Antidetect Browser",
    width: 1200,
    height: 630,
  };

  return {
    title,
    description,
    openGraph: {
      siteName: SITE_NAME,
      locale: locale,
      type: "website",
      images: [socialImage],
    },
    twitter: {
      card: "summary",
      images: [socialImage],
    },
    ...(!isProductionDomain() ? { robots: NO_INDEX_NO_FOLLOW_ROBOTS } : {}),
  };
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;
  const languageNavigation = await getLanguageNavigation(locale); // Map available blog and partners pages locale

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${abcDiatype.variable} font-diatype h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col">
        <NextIntlClientProvider>
          <ContextProviders>
            <Header languageNavigation={languageNavigation} />
            {children}
          </ContextProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
