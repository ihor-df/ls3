import Container from "@/components/atoms/container";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import { LocaleSlugParams } from "@/types/common";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { PortableText, type SanityDocument } from "next-sanity";
import { notFound } from "next/navigation";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;
const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset ? createImageUrlBuilder({ projectId, dataset }).image(source) : null;
const options = { next: { revalidate: 30 } };

const Page = async ({ params }: { params: LocaleSlugParams; searchParams: Promise<{ page?: string }> }) => {
  const { slug, locale } = await params;

  const post = await client.fetch<SanityDocument>(POST_QUERY, await params, options);
  const postImageUrl = post.image ? urlFor(post.image)?.width(550).height(310).url() : null;

  console.log("params:", { slug, locale });

  if (!post) {
    notFound();
  }

  return (
    <Container>
      <main className="container mx-auto flex min-h-screen flex-col gap-4 py-32">
        <Link href="/blog" className="hover:underline">
          ← Back to posts
        </Link>

        {postImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={postImageUrl} alt={post.title} className="aspect-video rounded-xl" width="550" height="310" />
        )}

        <h1 className="mb-8 text-4xl font-bold">{post.title}</h1>

        <div className="prose">
          <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p>
          {Array.isArray(post.body) && <PortableText value={post.body} />}
        </div>
      </main>
    </Container>
  );
};

export default Page;
