import JsonLd from "@/components/system/json-ld";
import { SITE_NAME } from "@/lib/constants";
import { generateUrl } from "@/lib/utils";
import type { Locale } from "next-intl";
import type { Organization, SoftwareApplication } from "schema-dts";

type StructuredDataProps = {
  locale: Locale;
  title: string;
  description: string;
};

export function StructuredData({ locale, title, description }: StructuredDataProps) {
  const organizationId = "https://ls.app/#organization";

  const softwareApplication: SoftwareApplication = {
    "@type": "SoftwareApplication",
    name: title,
    description,
    url: generateUrl(locale, "/"),
    operatingSystem: "Windows, macOS",
    applicationCategory: "BrowserApplication",
    applicationSubCategory: "Privacy Browser",
    author: { "@id": organizationId },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "0",
      highPrice: "300",
      offerCount: "5",
      availability: "https://schema.org/InStock",
      offers: { "@type": "Offer", url: generateUrl(locale, "/pricing") },
    },
    inLanguage: locale,
  };

  const organization: Organization = {
    "@type": "Organization",
    "@id": organizationId,
    name: SITE_NAME,
    legalName: "Legendary Software LTD",
    url: "https://ls.app/",
    logo: {
      "@type": "ImageObject",
      "@id": "https://ls.app/#logo",
      url: "https://ls.app/web-app-manifest-192x192.png",
      contentUrl: "https://ls.app/web-app-manifest-192x192.png",
      caption: SITE_NAME,
      width: { "@type": "QuantitativeValue", value: 192 },
      height: { "@type": "QuantitativeValue", value: 192 },
    },
    description:
      "Legendary Software LTD develops Linken Sphere, a professional antidetect browser for affiliate marketing, e-commerce, and crypto professionals. It provides advanced digital fingerprint protection, team collaboration tools, and seamless API automation.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "17 King Edwards Road",
      addressLocality: "Ruislip",
      addressRegion: "London",
      postalCode: "HA4 7AE",
      addressCountry: "GB",
    },
    email: "support@ls.app",
    sameAs: ["https://telegram.me/lsapp", "https://telegram.me/lscrew", "https://telegram.me/lsapp2en"],
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@ls.app",
      contactType: "customer support",
      availableLanguage: ["English", "Ukrainian", "Russian"],
    },
    foundingDate: "2017",
  };

  return <JsonLd data={[softwareApplication, organization]} />;
}
