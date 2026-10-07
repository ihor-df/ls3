import CollectionPageList from "@/components/molecules/collection-page-list";
import PostCard from "@/components/molecules/post-card";
import { Link } from "@/i18n/navigation";
import type { BlogPostPreview } from "@/types/blog";

const BlogPostList = ({ posts }: { posts: BlogPostPreview[] }) => {
  if (!posts.length) return null;

  return (
    <CollectionPageList>
      {posts.map(({ id, href, ...post }) => (
        <li key={id}>
          <Link href={href}>
            <PostCard page="blog" {...post} />
          </Link>
        </li>
      ))}
    </CollectionPageList>
  );
};

export default BlogPostList;
