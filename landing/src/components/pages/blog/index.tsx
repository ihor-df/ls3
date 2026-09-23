import CollectionPageList from "@/components/molecules/collection-page-list";
import LoadMoreButton from "@/components/molecules/load-more-button";
import PostCard from "@/components/molecules/post-card";
import CtaLg from "@/components/organisms/cta-lg";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils";
import { urlFor } from "@/sanity/helpers";
import type { ARTICLES_QUERY_RESULT, ARTICLE_CATEGORIES_QUERY_RESULT } from "@/sanity/sanity.types";
import { Locale } from "next-intl";
import CategoryFilters from "../../molecules/category-filters";

type BlogProps = {
  posts: ARTICLES_QUERY_RESULT;
  categories: ARTICLE_CATEGORIES_QUERY_RESULT;
  currentPage: number;
  hasMore: boolean;
  locale: Locale;
};

const Blog = ({ posts, categories, currentPage, hasMore, locale }: BlogProps) => {
  return (
    <div className="mt-10 flex flex-col">
      <CategoryFilters page="blog" categories={categories} />

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
    </div>
  );
};

export default Blog;
