import Container from "@/components/atoms/container";
import Article from "@/components/pages/blog/article";
import { SANITY_REVALIDATE_TIME } from "@/lib/constants";
import { sanityFetch } from "@/sanity/client";
import { LocaleSlugParams } from "@/types/common";
import { notFound } from "next/navigation";
import { ARTICLE_QUERY, ARTICLE_SLUGS_QUERY } from "../queries";

export async function generateStaticParams() {
  const post = await sanityFetch({
    query: ARTICLE_SLUGS_QUERY,
    perspective: "published",
    stega: false, // important for metadata and generateStaticParams
  });

  return post.map((post) => ({
    slug: post.slug,
  }));
}

const Page = async ({ params }: { params: LocaleSlugParams; searchParams: Promise<{ page?: string }> }) => {
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
