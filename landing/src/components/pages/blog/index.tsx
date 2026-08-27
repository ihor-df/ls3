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

      {!!posts?.length ? (
        <ul className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-2 md:gap-x-5 md:gap-y-16 xl:grid-cols-3">
          {posts.map((post) => {
            const postImageUrl = post?.image ? urlFor(post.image)?.width(413).height(232).url() : null;

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
        </ul>
      ) : (
        <div className="flex h-100 items-center justify-center text-lg text-[#C3C3C3]">
          <p>No articles :(</p>
        </div>
      )}

      {hasMore && <LoadMoreButton currentPage={currentPage} />}

      <CtaLg variant="get-started" className="mt-35 md:mt-40" />
    </div>
  );
};

export default Blog;
