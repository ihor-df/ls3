import { Link } from "@/i18n/navigation";
import type { POSTS_QUERY_RESULT } from "@/sanity/sanity.types";

type BlogProps = { posts: POSTS_QUERY_RESULT };

const Blog = ({ posts }: BlogProps) => {
  return (
    <>
      {!!posts?.length && (
        <ul className="flex flex-col gap-y-4">
          {posts.map((post) => (
            <li className="hover:underline" key={post._id}>
              <Link href={`/blog/${post.slug?.current ?? ""}`}>
                <h2 className="text-xl font-semibold">{post.title}</h2>
                {post.publishedAt && <p>{new Date(post.publishedAt).toLocaleDateString()}</p>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Blog;
