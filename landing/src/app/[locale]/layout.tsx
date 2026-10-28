import Header from "@/components/organisms/header-navigation";
import ContextProviders from "@/context/context-providers";
import { getGoogleConsentState } from "@/lib/analytics";
import { DEFAULT_OG_IMAGE_URL, NO_INDEX_NO_FOLLOW_ROBOTS, SITE_NAME } from "@/lib/constants";
import { ESSENTIAL_COOKIE_PREFERENCES } from "@/lib/cookie-consent/types";
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
import Script from "next/script";
import { ReactNode } from "react";
import { StructuredData } from "./structured-data";

import "../globals.css";

type RootLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

async function getSiteMetadata(locale: string) {
  const [t, siteSettings] = await Promise.all([
    getTranslations({ locale, namespace: "metadata" }),
    sanityFetch<SITE_SETTINGS_QUERY_RESULT>({
      query: SITE_SETTINGS_QUERY,
      params: { locale },
      tags: [sanityTags.siteSettings],
    }),
  ]);

  return {
    title: siteSettings?.title || t("title"),
    description: siteSettings?.description || t("description"),
  };
}

export async function generateMetadata({ params }: Pick<RootLayoutProps, "params">): Promise<Metadata> {
  const { locale } = await params;
  const { title, description } = await getSiteMetadata(locale);

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
  const gtmId = isProductionDomain() ? process.env.GTM_ID : undefined;
  const crispWebsiteId = process.env.CRISP_WEBSITE_ID;

  const [languageNavigation, siteMetadata] = await Promise.all([
    getLanguageNavigation(locale), // Map available blog and partners pages locale
    getSiteMetadata(locale),
  ]);

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${abcDiatype.variable} font-diatype h-full antialiased`}
    >
      <head>
        {gtmId && (
          <Script
            id="google-tag-manager"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
            window.gtag('consent', 'default', ${JSON.stringify(getGoogleConsentState(ESSENTIAL_COOKIE_PREFERENCES))});
            window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});
            var gtmScript=document.createElement('script');
            gtmScript.async=true;
            gtmScript.src='https://www.googletagmanager.com/gtm.js?id='+${JSON.stringify(gtmId)};
            document.head.appendChild(gtmScript);
          `,
            }}
          />
        )}
        <StructuredData locale={locale} {...siteMetadata} />
      </head>

      <body className="relative flex min-h-full flex-col">
        <NextIntlClientProvider>
          <ContextProviders crispWebsiteId={crispWebsiteId}>
            <Header languageNavigation={languageNavigation} />
            {children}
          </ContextProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
