import Container from "@/components/atoms/container";
import Heading from "@/components/atoms/page-title";
import SearchInput from "@/components/atoms/search-input";
import Blog from "@/components/pages/blog";
import { SANITY_REVALIDATE_TIME } from "@/lib/constants";
import { sanityFetch } from "@/sanity/client";
import { LocaleParams } from "@/types/common";
import { ARTICLES_QUERY, CATEGORIES_QUERY } from "./queries";

const Page = async ({ params }: { params: LocaleParams; searchParams: Promise<{ page?: string }> }) => {
  const { locale } = await params;

  const posts = await sanityFetch({
    params: { locale },
    query: ARTICLES_QUERY,
    revalidate: SANITY_REVALIDATE_TIME,
  });

  const categories = await sanityFetch({
    params: { locale },
    query: CATEGORIES_QUERY,
    revalidate: SANITY_REVALIDATE_TIME,
  });

  return (
    <Container as="main">
      <div className="justify-between md:flex">
        <Heading variant="page-sm">Blog</Heading>
        <SearchInput className="max-md:hidden" />
      </div>

      <Blog posts={posts} categories={categories} />
    </Container>
  );
};

export default Page;
