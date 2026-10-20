import JsonLd from "@/components/system/json-ld";
import { getPaginationPath } from "@/lib/pagination";
import { generateUrl } from "@/lib/utils";
import type { Locale } from "next-intl";
import type { CollectionPage } from "schema-dts";

type StructuredDataProps = {
  locale: Locale;
  slug: string;
  title: string;
  description?: string | null;
  page: number;
};

export function StructuredData({ locale, slug, title, description, page }: StructuredDataProps) {
  const collection: CollectionPage = {
    "@type": "CollectionPage",
    name: title,
    description: description?.trim() || undefined,
    url: generateUrl(locale, getPaginationPath(`/blog/category/${slug}`, page)),
    inLanguage: locale,
  };

  return <JsonLd data={collection} />;
}
