import Container from "@/components/atoms/container";
import Article from "@/components/pages/partners/article";
import { routing } from "@/i18n/routing";
import { SANITY_REVALIDATE_TIME } from "@/lib/constants";
import { sanityFetch } from "@/sanity/client";
import { LocaleSlugParams } from "@/types/common";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { PARTNER_QUERY, PARTNER_SLUGS_QUERY } from "../api";

export async function generateStaticParams() {
  const posts = await sanityFetch({
    query: PARTNER_SLUGS_QUERY,
    perspective: "published",
    stega: false,
  });

  return posts.flatMap(({ language, slug }) =>
    language && routing.locales.includes(language as (typeof routing.locales)[number])
      ? [{ locale: language, slug }]
      : [],
  );
}

type PageProps = {
  params: LocaleSlugParams;
  searchParams: Promise<{ page?: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { slug, locale } = await params;
  const t = await getTranslations("partners");

  const post = await sanityFetch({
    params: { slug, locale },
    query: PARTNER_QUERY,
    revalidate: SANITY_REVALIDATE_TIME,
  });

  if (!post) notFound();

  const breadcrumbs = post
    ? [
        {
          label: t("title"),
          href: "/partners",
        },
        {
          label: post?.title,
        },
      ]
    : undefined;

  return (
    <Container>
      <Article breadcrumbs={breadcrumbs} post={post} />
    </Container>
  );
};

export default Page;
