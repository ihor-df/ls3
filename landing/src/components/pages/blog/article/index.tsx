"use client";

import AvatarCard from "@/components/atoms/avatar-card";
import ButtonRounded from "@/components/atoms/button-rounded";
import Heading from "@/components/atoms/heading";
import Button from "@/components/atoms/main-button";
import ArticleNav from "@/components/molecules/article-nav";
import { BreadcrumbItemData, Breadcrumbs } from "@/components/molecules/breadcrumbs";
import CategoryDate from "@/components/molecules/category-date";
import { usePathname } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils";
import { urlFor } from "@/sanity/helpers";
import type { ARTICLE_QUERY_RESULT } from "@/sanity/sanity.types";
import Share from "@assets/icons/share.svg";
import logo from "@public/images/logo-sm@2x.png";
import { Locale } from "next-intl";
import { PortableText } from "next-sanity";
import { Image as SanityImage } from "next-sanity/image";
import Image from "next/image";
import { getHeadingId, portableTextComponents } from "./components/portable-text";

type ArticleProps = {
  post: NonNullable<ARTICLE_QUERY_RESULT>;
  breadcrumbs?: BreadcrumbItemData[];
  locale: Locale;
};

const Article = ({ post, breadcrumbs, locale }: ArticleProps) => {
  const { image, categories, publishedAt, title, body, author } = post;

  const postImageUrl = image ? urlFor(image)?.width(820).height(462).url() : null;
  const pathname = usePathname();
  const authorImageUrl = post.author?.avatar ? urlFor(post.author.avatar)?.width(48).height(48).url() : null;

  const tableOfContents =
    post.tableOfContents?.map(({ _key, title }) => ({
      title,
      href: `#${getHeadingId(_key)}`,
    })) ?? [];

  return (
    <>
      <article className="mx-auto min-h-screen w-full min-w-0 leading-[1.4] text-[#C3C3C3] md:text-xl xl:max-w-3xl">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} pathname={pathname} />}
        {(categories || publishedAt) && (
          <CategoryDate
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
            className="mt-5 aspect-350/197 w-full rounded-[20px] border border-white/10 md:rounded-[40px]"
            loading="eager"
          />
        )}

        <div className="mt-5 flex items-center justify-between">
          <AvatarCard
            alt="Publisher avatar"
            src={authorImageUrl ?? ""}
            name={author?.name ?? ""}
            role={author?.role ?? ""}
          />

          <ButtonRounded>
            <Share className="size-5.5" />
          </ButtonRounded>
        </div>

        <ArticleNav content={tableOfContents} />

        <section className="items-center p-5 max-md:text-center md:flex md:gap-6 md:p-10">
          <Image src={logo} alt="Linken Sphere logo" className="mx-auto" />

          <strong className="text-[1.75rem] leading-[1.2] font-bold tracking-[-0.02em] max-md:mt-2 md:tracking-[-0.03em]">
            Work anonymously with Linken Sphere
          </strong>

          <Button className="mx-auto text-nowrap max-md:mt-5 md:ml-auto">Start for free</Button>
        </section>

        {Array.isArray(body) && <PortableText value={body} components={portableTextComponents} />}
      </article>
    </>
  );
};

export default Article;
