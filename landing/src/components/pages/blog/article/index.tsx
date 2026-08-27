"use client";

import Heading from "@/components/atoms/heading";
import ArticleNav from "@/components/molecules/article-nav";
import AvatarCard from "@/components/molecules/avatar-card";
import { BreadcrumbItemData, Breadcrumbs } from "@/components/molecules/breadcrumbs";
import CategoryAndDate from "@/components/molecules/category-date";
import { getHeadingId, portableTextComponents } from "@/components/molecules/portable-text/components";
import { ShareSocial } from "@/components/molecules/share-social";
import CtaLg from "@/components/organisms/cta-lg";
import CtaSm from "@/components/organisms/cta-sm";
import FAQ from "@/components/organisms/faq";
import { buildAbsoluteUrl, formatDate } from "@/lib/utils";
import { urlFor } from "@/sanity/helpers";
import type { ARTICLE_QUERY_RESULT } from "@/sanity/sanity.types";
import { Locale } from "next-intl";
import { PortableText } from "next-sanity";
import { Image as SanityImage } from "next-sanity/image";

type ArticleProps = {
  post: NonNullable<ARTICLE_QUERY_RESULT>;
  breadcrumbs?: BreadcrumbItemData[];
  locale: Locale;
};

const Article = ({ post, breadcrumbs, locale }: ArticleProps) => {
  const { image, categories, publishedAt, title, body, author, faq, slug } = post;

  const postImageUrl = image ? urlFor(image)?.width(820).height(462).url() : null;
  const authorImageUrl = post.author?.avatar ? urlFor(post.author.avatar)?.width(48).height(48).url() : null;

  const tableOfContents =
    post.tableOfContents?.map(({ _key, title }) => ({
      title,
      href: `#${getHeadingId(_key)}`,
    })) ?? [];

  const selfUrl = buildAbsoluteUrl(locale, `/blog/${slug}`);

  return (
    <article className="min-h-screen leading-[1.4] text-[#C3C3C3] md:text-xl">
      <div className="mx-auto w-full min-w-0 xl:max-w-3xl">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}

        {(categories || publishedAt) && (
          <CategoryAndDate
            page="blog"
            linked
            categories={categories ?? []}
            date={publishedAt ? formatDate(publishedAt, locale) : undefined}
            className="mt-10"
          />
        )}

        <Heading variant="article" className="mt-5">
          {title}
        </Heading>

        {postImageUrl && (
          <SanityImage
            src={postImageUrl}
            alt="Author photo"
            width="550"
            height="310"
            className="rounded-small md:rounded-large mt-5 aspect-350/197 w-full border border-white/10"
            loading="eager"
          />
        )}

        <div className="mt-5 flex items-center justify-between">
          <AvatarCard alt="Publisher avatar" src={authorImageUrl ?? ""} name={author?.name} role={author?.role ?? ""} />
          <ShareSocial url={selfUrl} title={title} imageUrl={postImageUrl ?? ""} />
        </div>

        <ArticleNav content={tableOfContents} />
        <CtaSm hasDiscount />

        {/* Content */}
        {Array.isArray(body) && <PortableText value={body} components={portableTextComponents} />}

        {faq && <FAQ data={faq} className="mt-35 md:mt-40" />}
      </div>

      <hr className="my-18 border-white/10 md:my-40" />
      <CtaLg variant="get-started" />
    </article>
  );
};

export default Article;
