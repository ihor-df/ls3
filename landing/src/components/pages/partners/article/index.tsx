"use client";

import Heading from "@/components/atoms/heading";
import { BreadcrumbItemData, Breadcrumbs } from "@/components/molecules/breadcrumbs";
import CategoryAndDate from "@/components/molecules/category-date";
import { portableTextComponents } from "@/components/molecules/portable-text/components";
import Cta from "@/components/organisms/cta";
import { usePathname } from "@/i18n/navigation";
import { buildAbsoluteUrl } from "@/lib/utils";
import { urlFor } from "@/sanity/helpers";
import type { PARTNER_QUERY_RESULT } from "@/sanity/sanity.types";
import orange from "@public/images/orange-cloud-bg.webp";
import { Locale } from "next-intl";
import { PortableText } from "next-sanity";
import { Image as SanityImage } from "next-sanity/image";

type ArticleProps = {
  post: NonNullable<PARTNER_QUERY_RESULT>;
  breadcrumbs?: BreadcrumbItemData[];
  locale: Locale;
};

const Article = ({ post, breadcrumbs, locale }: ArticleProps) => {
  const { logo, categories, publishedAt, title, body, slug } = post;

  const pathname = usePathname();
  const postImageUrl = logo ? urlFor(logo)?.width(820).height(462).url() : null;

  const selfUrl = buildAbsoluteUrl(locale, `/partners/${slug}`);

  return (
    <article className="min-h-screen leading-[1.4] text-[#C3C3C3] md:text-xl">
      <div className="mx-auto w-full min-w-0 xl:max-w-3xl">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} pathname={pathname} />}

        {postImageUrl && (
          <SanityImage
            style={{ backgroundImage: `url(${orange.src})` }}
            src={postImageUrl}
            alt="Author photo"
            width="550"
            height="310"
            className="rounded-small md:rounded-large mt-10 aspect-350/197 w-full border border-white/10 bg-cover bg-center"
            loading="eager"
          />
        )}

        <div className="mt-5 flex items-center justify-between md:mt-10">
          <Heading variant="article">{title}</Heading>

          {(categories || publishedAt) && (
            <CategoryAndDate page="partners" linked categories={categories} className="ml-5 md:ml-10" />
          )}
        </div>

        {/* Content */}
        {Array.isArray(body) && <PortableText value={body} components={portableTextComponents} />}
      </div>

      <Cta size="lg" className="mt-18 md:mt-40" />
    </article>
  );
};

export default Article;
