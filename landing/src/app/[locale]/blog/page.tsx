import { routing } from "@/i18n/routing";
import type { LocaleParams } from "@/types/common";
import { BlogListing } from "./listing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Page({ params }: { params: LocaleParams }) {
  const { locale } = await params;

  return <BlogListing locale={locale} page={1} />;
}
