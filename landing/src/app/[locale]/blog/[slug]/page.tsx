import Container from "@/components/atoms/container";
import Article from "@/components/pages/blog/article";
import { routing } from "@/i18n/routing";
import { SANITY_REVALIDATE_TIME } from "@/lib/constants";
import { sanityFetch } from "@/sanity/client";
import { LocaleSlugParams } from "@/types/common";
import { notFound } from "next/navigation";
import { ARTICLE_QUERY, ARTICLE_SLUGS_QUERY } from "../queries";

export async function generateStaticParams() {
  const posts = await sanityFetch({
    query: ARTICLE_SLUGS_QUERY,
    perspective: "published",
    stega: false, // important for metadata and generateStaticParams
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

  const post = await sanityFetch({
    params: { slug, locale },
    query: ARTICLE_QUERY,
    revalidate: SANITY_REVALIDATE_TIME,
  });

  if (!post) notFound();

  const breadcrumbs = post
    ? [
        {
          label: "Blog",
          href: "/blog",
        },
        {
          label: post?.title,
        },
      ]
    : undefined;

  return (
    <Container>
      <Article breadcrumbs={breadcrumbs} post={post} locale={locale} />
    </Container>
  );
};

export default Page;
