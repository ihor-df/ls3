import CtaLg from "@/components/organisms/cta/cta-lg";
import BlogPage from "@/components/pages/blog";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
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

  const [{ posts, pageCount }, t] = await Promise.all([
    getArticlesData(locale, { page, categoryId: category?._id }),
    getTranslations({ locale, namespace: "blog" }),
  ]);

  if (page > Math.max(1, pageCount) || (category && !posts.length)) notFound();

  return (
    <BlogPage
      posts={posts}
      categories={categories}
      currentPage={page}
      pageCount={pageCount}
      paginationBasePath={category ? `/blog/category/${category.slug}` : "/blog"}
      activeCategory={category?.slug ?? null}
      title={category?.title ?? t("title")}
    >
      {/* server content as children */}
      <CtaLg variant="get-started" />
    </BlogPage>
  );
}
