import Container from "@/components/atoms/container";
import Article from "@/components/pages/blog/article";
import { client } from "@/sanity/client";
import { LocaleSlugParams } from "@/types/common";
import { defineQuery } from "next-sanity";
import { notFound } from "next/navigation";

const options = { next: { revalidate: 60 } };

const ARTICLE_QUERY = defineQuery(`
  *[_type == "article" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    publishedAt,
    image,
    body
  }
`);

const Page = async ({ params }: { params: LocaleSlugParams; searchParams: Promise<{ page?: string }> }) => {
  // const { slug, locale } = await params;

  const post = await client.fetch(ARTICLE_QUERY, await params, options);

  if (!post) {
    notFound();
  }

  return (
    <Container as="main">
      <Article post={post} />
    </Container>
  );
};

export default Page;
