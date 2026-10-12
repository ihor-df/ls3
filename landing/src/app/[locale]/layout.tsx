import Header from "@/components/organisms/header-navigation";
import BlogSearchProvider from "@/context/blog-search-provider";
import PartnersSearchProvider from "@/context/partners-search-provider";
import { NO_INDEX_NO_FOLLOW_ROBOTS } from "@/lib/constants";
import { sanityTags } from "@/sanity/cache-tags";
import { sanityFetch } from "@/sanity/client";
import { getLanguageNavigation } from "@/sanity/language-navigation";
import type { SITE_SETTINGS_QUERY_RESULT } from "@/sanity/sanity.types";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { defineQuery } from "next-sanity";
import localFont from "next/font/local";
import { ReactNode } from "react";
import "../globals.css";

const abcDiatype = localFont({
  src: [
    {
      path: "../../assets/fonts/ABCDiatypeCyrillic/ABCDiatypeCyrillic-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../assets/fonts/ABCDiatypeCyrillic/ABCDiatypeCyrillic-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../assets/fonts/ABCDiatypeCyrillic/ABCDiatypeCyrillic-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "fallback",
  variable: "--font-abc-diatype",
});

type RootLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    defaultOgImage {
      asset->{
        url,
        metadata { dimensions { width, height } }
      }
    }
  }
`);

export async function generateMetadata({ params }: Pick<RootLayoutProps, "params">): Promise<Metadata> {
  const { locale } = await params;

  const [t, siteSettings] = await Promise.all([
    getTranslations({ locale, namespace: "metadata" }),
    sanityFetch<SITE_SETTINGS_QUERY_RESULT>({
      query: SITE_SETTINGS_QUERY,
      tags: [sanityTags.siteSettings],
      stega: false,
    }),
  ]);

  const title = t("title");
  const description = t("description");
  const ogImage = siteSettings?.defaultOgImage?.asset;

  const socialImage = {
    url: ogImage?.url ?? "https://ls.app/images/thumbnail-for-sharing.webp",
    alt: "Linken Sphere Antidetect Browser",
    width: ogImage?.metadata?.dimensions?.width ?? 1200,
    height: ogImage?.metadata?.dimensions?.height ?? 630,
  };

  return {
    title,
    description,
    robots: process.env.APP_DOMAIN !== "ls.app" ? NO_INDEX_NO_FOLLOW_ROBOTS : undefined,
    openGraph: {
      siteName: "Linken Sphere",
      locale: locale,
      type: "website",
      images: [socialImage],
    },
    twitter: {
      card: "summary",
      images: [socialImage],
    },
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
          <BlogSearchProvider>
            <PartnersSearchProvider>
              <Header languageNavigation={languageNavigation} />
              {children}
            </PartnersSearchProvider>
          </BlogSearchProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
