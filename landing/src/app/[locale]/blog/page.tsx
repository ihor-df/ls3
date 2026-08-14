import Container from "@/components/atoms/container";
import Heading from "@/components/atoms/page-title";
import SearchInput from "@/components/atoms/search-input";
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
    <Container as="main">
      <div className="justify-between md:flex">
        <Heading variant="page-sm">Blog</Heading>
        <SearchInput className="max-md:hidden" />
      </div>

      <Blog posts={posts} />
    </Container>
  );
};

export default Page;
