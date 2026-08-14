import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import type { ARTICLE_QUERY_RESULT } from "@/sanity/sanity.types";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { PortableText, PortableTextComponents } from "next-sanity";
import { Image } from "next-sanity/image";

type ArticleProps = {
  post: NonNullable<ARTICLE_QUERY_RESULT>;
};

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-base leading-7 text-white/72">{children}</p>,
    h2: ({ children }) => <h2 className="mt-10 text-3xl leading-tight font-bold text-white">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 text-2xl leading-tight font-bold text-white">{children}</h3>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "#";
      const isExternal = href.startsWith("http");

      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noreferrer noopener" : undefined}
          className="text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
  },
  list: {
    bullet: ({ children }) => <ul className="my-6 list-disc space-y-2 pl-5 text-white/72">{children}</ul>,
    number: ({ children }) => <ol className="my-6 list-decimal space-y-2 pl-5 text-white/72">{children}</ol>,
  },
};

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset ? createImageUrlBuilder({ projectId, dataset }).image(source) : null;

const Article = ({ post }: ArticleProps) => {
  const postImageUrl = post?.image ? urlFor(post.image)?.width(550).height(310).url() : null;

  return (
    <article className="mx-auto flex min-h-screen flex-col gap-4 py-32">
      <Link href="/blog" className="hover:underline">
        ← Back to posts
      </Link>

      {postImageUrl && (
        <Image src={postImageUrl} alt="Author photo" width="550" height="310" className="aspect-video rounded-xl" />
      )}

      <h1 className="mb-8 text-4xl font-bold">{post.title}</h1>

      {post.publishedAt && <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p>}
      {Array.isArray(post.body) && <PortableText value={post.body} components={portableTextComponents} />}
    </article>
  );
};

export default Article;
