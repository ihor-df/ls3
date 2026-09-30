import Header from "@/components/organisms/header";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
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

export async function generateMetadata({ params }: Pick<RootLayoutProps, "params">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      title,
      description,
    },
  };
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${abcDiatype.variable} font-diatype h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col">
        <NextIntlClientProvider>
          <Header />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
