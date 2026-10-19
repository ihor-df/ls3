import Container from "@/components/atoms/container";
import PartnerArticle from "@/components/pages/partners/article";
import { generateCollectionPageMetadata } from "@/helpers/metadata/generate-collection-metadata";
import { routing } from "@/i18n/routing";
import { sanityTags } from "@/sanity/cache-tags";
import { sanityFetch } from "@/sanity/client";
import { LocaleSlugPageProps } from "@/types/common";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { PARTNER_SLUGS_QUERY } from "../api";
import { getPartner } from "../data";

export async function generateStaticParams() {
  const posts = await sanityFetch({
    query: PARTNER_SLUGS_QUERY,
    tags: routing.locales.map(sanityTags.partnersList),
    perspective: "published",
  });

  return posts.flatMap(({ language, slug }) =>
    language && routing.locales.includes(language as (typeof routing.locales)[number])
      ? [{ locale: language, slug }]
      : [],
  );
}

export async function generateMetadata({ params }: LocaleSlugPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  const partner = await getPartner(slug, locale);

  if (!partner) {
    notFound();
  }

  return generateCollectionPageMetadata({
    locale,
    pathname: `/partners/${slug}`,
    title: partner.seo?.title || partner.title,
    description: partner.seo?.description,
    ogImage: partner.seo?.ogImage,
    noIndex: !!partner.seo?.noIndex,
  });
}

const Page = async ({ params }: LocaleSlugPageProps) => {
  const { slug, locale } = await params;
  const t = await getTranslations("partners");

  const partner = await getPartner(slug, locale);

  if (!partner) notFound();

  const breadcrumbs = partner
    ? [
        {
          label: t("title"),
          href: "/partners",
        },
        {
          label: partner?.title,
        },
      ]
    : undefined;

  return (
    <Container>
      <PartnerArticle breadcrumbs={breadcrumbs} post={partner} />
    </Container>
  );
};

export default Page;
