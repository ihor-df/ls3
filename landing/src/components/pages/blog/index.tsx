import PostCard from "@/components/molecules/post-card";
import { Link } from "@/i18n/navigation";
import { urlFor } from "@/sanity/helpers";
import type { ARTICLES_QUERY_RESULT } from "@/sanity/sanity.types";

type BlogProps = { posts: ARTICLES_QUERY_RESULT };

const Blog = ({ posts }: BlogProps) => {
  return (
    <div className="mt-10">
      {!!posts?.length && (
        <ul className="grid grid-cols-1 gap-7 md:grid-cols-2 md:gap-x-5 md:gap-y-16 xl:grid-cols-3">
          {posts.map((post) => {
            const postImageUrl = post?.image ? urlFor(post.image)?.width(413).height(232).url() : null;

            return (
              <li className="hover:underline" key={post._id}>
                <Link href={`/blog/${post.slug?.current ?? ""}`}>
                  <PostCard
                    date={post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : undefined}
                    description={post.title ?? ""}
                    imageSrc={postImageUrl ?? ""}
                    tags={["Crypto"]}
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
