import PostCard from "@/components/molecules/post-card";
import { Link } from "@/i18n/navigation";
import { cn, formatDate } from "@/lib/utils";
import { urlFor } from "@/sanity/helpers";
import type { ARTICLES_QUERY_RESULT, CATEGORIES_QUERY_RESULT } from "@/sanity/sanity.types";
import { Locale } from "next-intl";
import { ReactNode } from "react";

type BlogProps = { posts: ARTICLES_QUERY_RESULT; categories: CATEGORIES_QUERY_RESULT; locale: Locale };

const CategoryItem = ({ children, className, href }: { className?: string; children: ReactNode; href: string }) => {
  return (
    <li
      className={cn(
        "leading-[1.2] font-medium tracking-[-0.01em] text-white/60 transition-colors hover:text-white hover:underline",
        className,
      )}
    >
      <Link href={href}>{children}</Link>
    </li>
  );
};

const Blog = ({ posts, categories, locale }: BlogProps) => {
  return (
    <div className="mt-10">
      <ul className="flex flex-wrap gap-x-6 md:gap-x-8 md:gap-y-5">
        <CategoryItem href="">All articles</CategoryItem>
        {categories.map((c) => (
          <CategoryItem href="" key={c._id}>
            {c.title}
          </CategoryItem>
        ))}
      </ul>

      {!!posts?.length && (
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
      )}
    </div>
  );
};

export default Blog;
