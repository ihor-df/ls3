import Container from "@/components/atoms/container";
import Blog from "@/components/pages/blog";
import { SANITY_REVALIDATE_TIME } from "@/lib/constants";
import { sanityFetch } from "@/sanity/client";
import { ARTICLES_QUERY } from "./queries";

type PageProps = {};

const Page = async ({}: PageProps) => {
  const posts = await sanityFetch({
    query: ARTICLES_QUERY,
    revalidate: SANITY_REVALIDATE_TIME,
  });

  return (
    <Container as="main" className="py-32">
      <h1 className="mb-8 text-4xl font-bold">Articles</h1>
      <Blog posts={posts} />
    </Container>
  );
};

export default Page;
