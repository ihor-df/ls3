import JsonLd from "@/components/system/json-ld";
import { generateUrl } from "@/lib/utils";
import type { ARTICLE_QUERY_RESULT } from "@/sanity/sanity.types";
import type { Locale } from "next-intl";
import type { Article } from "schema-dts";

type StructuredDataProps = {
  post: NonNullable<ARTICLE_QUERY_RESULT>;
  locale: Locale;
  slug: string;
};

export function StructuredData({ post, locale, slug }: StructuredDataProps) {
  const url = generateUrl(locale, `/blog/${slug}`);
  const organization = { "@id": "https://ls.app/#organization" };

  const article: Article = {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.seo?.description?.trim() || undefined,
    image: post.image?.asset?.url ? [post.image.asset.url] : undefined,
    datePublished: post.publishedAt || undefined,
    dateModified: post._updatedAt || undefined,
    author: post.author?.name?.trim() ? { "@type": "Person", name: post.author.name } : organization,
    publisher: organization,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: locale,
  };

  return <JsonLd data={article} />;
}
