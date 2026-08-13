import Container from "@components/atoms/container";
import Image from "next/image";
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
import { Link } from "@/i18n/navigation";

export default async function Home() {

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;

const options = { next: { revalidate: 30 } };
const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

  return (
    <Container>
      <main className="py-32">
        <Image className="h-5 w-25 dark:invert" src="/next.svg" alt="Next.js logo" width={100} height={20} priority />

        <ul className="flex flex-col gap-y-4 mt-10">
        {posts.map((post) => (
          <li className="hover:underline" key={post._id}>
            <Link href={`/${post.slug.current}`}>
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
            </Link>
          </li>
        ))}
      </ul>
      </main>
    </Container>
  );
}
