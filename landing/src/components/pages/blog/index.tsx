import LoadMoreButton from "@/components/molecules/load-more-button";
import PostCard from "@/components/molecules/post-card";
import Cta from "@/components/organisms/cta";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils";
import { urlFor } from "@/sanity/helpers";
import type { ARTICLES_QUERY_RESULT, CATEGORIES_QUERY_RESULT } from "@/sanity/sanity.types";
import { Locale } from "next-intl";
import Filters from "./filters";

type BlogProps = {
  posts: ARTICLES_QUERY_RESULT;
  categories: CATEGORIES_QUERY_RESULT;
  currentPage: number;
  hasMore: boolean;
  locale: Locale;
};

const Blog = ({ posts, categories, currentPage, hasMore, locale }: BlogProps) => {
  return (
    <div className="mt-10 flex flex-col">
      <Filters categories={categories} />

      {!!posts?.length ? (
        <ul className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-2 md:gap-x-5 md:gap-y-16 xl:grid-cols-3">
          {posts.map((post) => {
            const postImageUrl = post?.image ? urlFor(post.image)?.width(413).height(232).url() : null;

            return (
              <li key={post._id}>
                <Link href={`/blog/${post.slug?.current ?? ""}`}>
                  <PostCard
                    date={post.publishedAt ? formatDate(post.publishedAt, locale) : undefined}
                    description={post.title ?? ""}
                    imageSrc={postImageUrl ?? ""}
                    categories={post.categories ?? []}
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

      <Cta size="lg" className="mt-35 md:mt-40" />
    </div>
  );
};

export default Blog;
