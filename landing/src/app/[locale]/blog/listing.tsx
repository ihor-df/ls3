import CtaLg from "@/components/organisms/cta/cta-lg";
import BlogPage from "@/components/pages/blog";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getPageQuery } from "../api";
import { getArticleCategories, getArticlesData } from "./data";

type BlogListingProps = {
  locale: Locale;
  page: number;
  categorySlug?: string;
};

export async function BlogListing({ locale, page, categorySlug }: BlogListingProps) {
  const categories = await getArticleCategories(locale);
  const category = categorySlug ? categories.find(({ slug }) => slug === categorySlug) : undefined;

  if (categorySlug && !category) notFound();

  const [t, { posts, pageCount }, data] = await Promise.all([
    getTranslations({ locale, namespace: "blog" }),
    getArticlesData(locale, { page, categoryId: category?._id }),
    category?.title == null ? getPageQuery("blog", locale) : null,
  ]);

  if (page > Math.max(1, pageCount) || (category && !posts.length)) notFound();

  const title = data?.mainTitle ? data.mainTitle : t("title");

  return (
    <BlogPage
      posts={posts}
      categories={categories}
      currentPage={page}
      pageCount={pageCount}
      paginationBasePath={category ? `/blog/category/${category.slug}` : "/blog"}
      activeCategory={category?.slug ?? null}
      title={category?.title ?? title}
    >
      {/* server components */}
      <CtaLg variant="get-started" />
    </BlogPage>
  );
}
