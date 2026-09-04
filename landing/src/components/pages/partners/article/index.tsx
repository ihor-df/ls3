import GlassButton from "@/components/atoms/glass-button";
import Heading from "@/components/atoms/heading";

import { BreadcrumbItemData, Breadcrumbs } from "@/components/molecules/breadcrumbs";
import CategoryAndDate from "@/components/molecules/category-date";
import { portableTextComponents } from "@/components/molecules/portable-text/components";

import CtaLg from "@/components/organisms/cta-lg";
import { urlFor } from "@/sanity/helpers";
import type { PARTNER_QUERY_RESULT } from "@/sanity/sanity.types";
import orange from "@public/images/orange-cloud-bg.webp";
import { getTranslations } from "next-intl/server";
import { PortableText } from "next-sanity";
import { Image as SanityImage } from "next-sanity/image";
import DiscountBanner from "./partner-discount";

type ArticleProps = {
  post: NonNullable<PARTNER_QUERY_RESULT>;
  breadcrumbs?: BreadcrumbItemData[];
};

const Article = async ({ post, breadcrumbs }: ArticleProps) => {
  const { logo, categories, publishedAt, title, body, description, discountPercent, discountText, promoCode, url } =
    post;

  const t = await getTranslations("partners.article");

  const postImageUrl = logo ? urlFor(logo)?.width(820).height(462).url() : null;

  return (
    <article className="min-h-screen leading-[1.4] text-[#C3C3C3] md:text-xl">
      <div className="mx-auto w-full max-w-3xl min-w-0">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}

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

        <p className="mt-5 md:mt-9">{description}</p>

        {discountPercent && discountText && (
          <DiscountBanner percent={discountPercent} text={discountText} promo={promoCode} />
        )}

        {/* Content */}
        {Array.isArray(body) && <PortableText value={body} components={portableTextComponents} />}

        {url && (
          <GlassButton
            linkProps={{
              href: url,
              target: "_blank",
              rel: "noopener",
            }}
            className="mt-5 md:mt-10"
          >
            {t("goToButton")} {title}
          </GlassButton>
        )}
      </div>

      <hr className="my-18 border-white/10 md:my-20" />
      <CtaLg variant="get-started" />
    </article>
  );
};

export default Article;
