import Container from "@/components/atoms/container";
import Blog from "@/components/pages/blog";
import { client } from "@/sanity/client";
import { defineQuery } from "next-sanity";

type PageProps = {};

const POSTS_QUERY = defineQuery(`
  *[_type == "article" && defined(slug.current)]|order(publishedAt desc)[0...12]{
    _id,
    title,
    slug,
    publishedAt
  }
`);
const options = { next: { revalidate: 60 } };

const Page = async ({}: PageProps) => {
  const posts = await client.fetch(POSTS_QUERY, {}, options);

  return (
    <Container as="main" className="py-32">
      <h1 className="mb-8 text-4xl font-bold">Articles</h1>

      <Blog posts={posts} />
    </Container>
  );
};

export default Page;
