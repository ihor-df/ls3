import Container from "@/components/atoms/container";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";

type PageProps = {};

const Page = async ({}: PageProps) => {
  const POSTS_QUERY = `*[
    _type == "post"
    && defined(slug.current)
  ]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;

  const options = { next: { revalidate: 60 } };
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

  return (
    <Container>
      <main className="py-32">
        <h1 className="mb-8 text-4xl font-bold">Articles</h1>

        <ul className="flex flex-col gap-y-4">
          {posts.map((post) => (
            <li className="hover:underline" key={post._id}>
              <Link href={`/blog/${post.slug.current}`}>
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </Container>
  );
};

export default Page;
