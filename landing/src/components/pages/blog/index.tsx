"use client";

import Container from "@/components/atoms/container";
import CollectionPageHeader from "@/components/molecules/collection-page-header";
import PagePagination from "@/components/molecules/page-pagination";
import { useBlogSearch } from "@/context/blog-search-provider";
import { BLOG_SEARCH_MAX_LENGTH } from "@/lib/blog-search";
import { imageBuilder } from "@/sanity/helpers";
import type { ARTICLES_QUERY_RESULT, ARTICLE_CATEGORIES_QUERY_RESULT } from "@/sanity/sanity.types";
import CategoryFilters from "@components/molecules/category-filters";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import BlogPostList from "./post-list";

type BlogPageProps = {
  posts: ARTICLES_QUERY_RESULT;
  categories: ARTICLE_CATEGORIES_QUERY_RESULT;
  currentPage: number;
  pageCount: number;
  paginationBasePath: string;
  activeCategory: string | null;
  title: string;
  children: ReactNode;
};

const BlogPage = ({
  posts,
  categories,
  currentPage,
  pageCount,
  paginationBasePath,
  activeCategory,
  title,
  children,
}: BlogPageProps) => {
  const t = useTranslations("blog");
  const { query, result, status, search } = useBlogSearch();

  const visiblePosts = (result?.posts ?? posts).map((post) => ({
    id: post._id,
    title: post.title,
    href: `/blog/${post.slug.current}`,
    imageSrc: post.image ? (imageBuilder(post.image)?.width(820).height(462).url() ?? "") : "",
    alt: post.image?.alt ?? "",
    categories: post.categories ?? [],
  }));

  const searchMessage =
    status === "error" ? t("search.error") : result && !result.posts.length ? t("search.empty") : undefined;

  return (
    <Container as="main">
      <CollectionPageHeader
        title={title}
        initialSearchValue=""
        searchClassName="max-lg:hidden"
        searchMaxLength={BLOG_SEARCH_MAX_LENGTH}
      />
      <CategoryFilters
        className="mt-10"
        allLabel={t("allLabel")}
        page="blog"
        categories={categories}
        activeCategory={activeCategory}
      />

      <section aria-label={query ? t("search.label") : undefined} aria-busy={status === "loading"}>
        {searchMessage && (
          <p role="status" aria-live="polite" className="text-light-grey mt-10 text-center">
            {searchMessage}
          </p>
        )}

        <BlogPostList posts={visiblePosts} />

        {visiblePosts.length > 0 &&
          (result ? (
            <PagePagination
              className="mt-16 md:mt-40"
              currentPage={result.page}
              pageCount={result.pageCount}
              disabled={status === "loading"}
              onPageChange={(nextPage) => void search(result.query, nextPage)}
            />
          ) : (
            <PagePagination
              className="mt-16 md:mt-40"
              basePath={paginationBasePath}
              currentPage={currentPage}
              pageCount={pageCount}
            />
          ))}
      </section>

      {/* server content */}
      {children}
    </Container>
  );
};

export default BlogPage;
