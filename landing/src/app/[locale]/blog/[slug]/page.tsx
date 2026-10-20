import BlogArticle from "@/components/pages/blog/article";
import { generateCollectionPageMetadata } from "@/helpers/metadata/generate-collection-metadata";
import { routing } from "@/i18n/routing";
import { sanityTags } from "@/sanity/cache-tags";
import { sanityFetch } from "@/sanity/client";
import { LocaleSlugPageProps } from "@/types/common";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ARTICLE_SLUGS_QUERY } from "../api";
import { getArticle } from "../data";
import { StructuredData } from "./structured-data";

export async function generateStaticParams() {
  const posts = await sanityFetch({
    query: ARTICLE_SLUGS_QUERY,
    tags: routing.locales.map(sanityTags.blogList),
    perspective: "published",
  });

  return posts.flatMap(({ language, slug }) =>
    language && routing.locales.includes(language as (typeof routing.locales)[number])
      ? [{ locale: language, slug }]
      : [],
  );
}

export async function generateMetadata({ params }: LocaleSlugPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  const article = await getArticle(slug, locale);

  if (!article) {
    notFound();
  }

  return generateCollectionPageMetadata({
    locale,
    pathname: `/blog/${slug}`,
    type: "article",
    title: article.seo?.title || article.title,
    description: article.seo?.description,
    ogImage: article.seo?.ogImage,
    noIndex: !!article.seo?.noIndex,
  });
}

const Page = async ({ params }: LocaleSlugPageProps) => {
  const { slug, locale } = await params;
  const t = await getTranslations("blog");

  const post = await getArticle(slug, locale);

  if (!post) notFound();

  const breadcrumbs = post
    ? [
        {
          label: t("title"),
          href: "/blog",
        },
        {
          label: post?.title,
        },
      ]
    : undefined;

  return (
    <>
      <StructuredData post={post} locale={locale} slug={slug} />
      <BlogArticle breadcrumbs={breadcrumbs} post={post} locale={locale} />
    </>
  );
};

export default Page;
