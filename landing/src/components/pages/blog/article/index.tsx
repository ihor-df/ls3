"use client";

import Heading from "@/components/atoms/heading";
import ArticleNav from "@/components/molecules/article-nav";
import AvatarCard from "@/components/molecules/avatar-card";
import { BreadcrumbItemData, Breadcrumbs } from "@/components/molecules/breadcrumbs";
import CategoryAndDate from "@/components/molecules/category-date";
import { ShareSocial } from "@/components/molecules/share-social";
import Cta from "@/components/organisms/cta";
import FAQ from "@/components/organisms/faq";
import { usePathname } from "@/i18n/navigation";
import { buildAbsoluteUrl, formatDate } from "@/lib/utils";
import { urlFor } from "@/sanity/helpers";
import type { ARTICLE_QUERY_RESULT } from "@/sanity/sanity.types";
import { Locale } from "next-intl";
import { PortableText } from "next-sanity";
import { Image as SanityImage } from "next-sanity/image";
import { getHeadingId, portableTextComponents } from "./portable-text/components";

type ArticleProps = {
  post: NonNullable<ARTICLE_QUERY_RESULT>;
  breadcrumbs?: BreadcrumbItemData[];
  locale: Locale;
};

const Article = ({ post, breadcrumbs, locale }: ArticleProps) => {
  const { image, categories, publishedAt, title, body, author, faq, slug } = post;

  const pathname = usePathname();
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
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} pathname={pathname} />}

        {(categories || publishedAt) && (
          <CategoryAndDate
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

          <ShareSocial
            url={selfUrl}
            title={title}
            description={
              "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores ipsam at assumenda earum blanditiis ratione quidem voluptas odio vitae harum modi quod iste, tempore dolor, saepe repellendus. Totam sequi molestiae adipisci nostrum amet quo aliquam voluptatem quia. Facere at ipsum aliquam nihil vitae, dolore fugit amet, error repellat doloremque quas."
            }
            imageUrl={postImageUrl ?? ""}
          />
        </div>

        <ArticleNav content={tableOfContents} />
        <Cta discount />

        {/* Content */}
        {Array.isArray(body) && <PortableText value={body} components={portableTextComponents} />}

        {faq && <FAQ data={faq} className="mt-35 md:mt-40" />}
      </div>
      <Cta size="lg" className="mt-18 md:mt-40" />
    </article>
  );
};

export default Article;
