import CollectionPageHeader from "@/components/atoms/collection-page-header";
import Container from "@/components/atoms/container";
import CollectionPageList from "@/components/molecules/collection-page-list";
import LoadMoreButton from "@/components/molecules/load-more-button";
import PostCard from "@/components/molecules/post-card";
import CtaLg from "@/components/organisms/cta-lg";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils";
import { urlFor } from "@/sanity/helpers";
import type { ARTICLES_QUERY_RESULT, ARTICLE_CATEGORIES_QUERY_RESULT } from "@/sanity/sanity.types";
import CategoryFilters from "@components/molecules/category-filters";
import { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";

type BlogPageProps = {
  posts: ARTICLES_QUERY_RESULT;
  categories: ARTICLE_CATEGORIES_QUERY_RESULT;
  currentPage: number;
  hasMore: boolean;
  locale: Locale;
  searchValue: string;
};

const BlogPage = async ({ posts, categories, currentPage, hasMore, locale, searchValue }: BlogPageProps) => {
  const t = await getTranslations("blog");

  return (
    <Container as="main">
      <CollectionPageHeader title={t("title")} initialSearchValue={searchValue} />
      <CategoryFilters className="mt-10" allLabel={t("allLabel")} page="blog" categories={categories} />

      {!!posts?.length && (
        <CollectionPageList>
          {posts.map((post) => {
            const postImageUrl = post?.image ? urlFor(post.image)?.width(820).height(462).url() : null;

            return (
              <li key={post._id}>
                <Link href={`/blog/${post.slug?.current}`}>
                  <PostCard
                    page="blog"
                    date={post.publishedAt ? formatDate(post.publishedAt, locale) : undefined}
                    title={post.title}
                    imageSrc={postImageUrl ?? ""}
                    categories={post.categories}
                    alt={post.image.alt}
                  />
                </Link>
              </li>
            );
          })}
        </CollectionPageList>
      )}

      {hasMore && <LoadMoreButton currentPage={currentPage} />}

      <CtaLg variant="get-started" className="mt-35 md:mt-40" />
    </Container>
  );
};

export default BlogPage;
