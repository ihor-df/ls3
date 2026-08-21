import Button from "@/components/atoms/main-button";
import PostCard from "@/components/molecules/post-card";
import Cta from "@/components/organisms/cta";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils";
import { urlFor } from "@/sanity/helpers";
import type { ARTICLES_QUERY_RESULT, CATEGORIES_QUERY_RESULT } from "@/sanity/sanity.types";
import { Locale } from "next-intl";
import { FilterItem } from "../../molecules/filter-item";

type BlogProps = { posts: ARTICLES_QUERY_RESULT; categories: CATEGORIES_QUERY_RESULT; locale: Locale };

const Blog = ({ posts, categories, locale }: BlogProps) => {
  return (
    <div className="mt-10 flex flex-col">
      <ul className="flex flex-wrap gap-x-6 md:gap-x-8 md:gap-y-5">
        <FilterItem href="/blog">All articles</FilterItem>
        {categories.map((c) => (
          <FilterItem href={`/blog/category/${c.slug}`} key={c._id}>
            {c.title}
          </FilterItem>
        ))}
      </ul>

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

      <Button className="mt-16 md:mt-40" size="large" variant="secondary">
        Load more
      </Button>

      <Cta size="lg" className="mt-35 md:mt-40" />
    </div>
  );
};

export default Blog;
