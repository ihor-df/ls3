import CollectionPageHeader from "@/components/atoms/collection-page-header";
import Container from "@/components/atoms/container";
import CollectionPageList from "@/components/molecules/collection-page-list";
import LoadMoreButton from "@/components/molecules/load-more-button";
import PostCard from "@/components/molecules/post-card";
import CtaLg from "@/components/organisms/cta-lg";
import { Link } from "@/i18n/navigation";
import { urlFor } from "@/sanity/helpers";
import type { PUBLICATIONS_QUERY_RESULT } from "@/sanity/sanity.types";
import { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";

type PublicationsProps = {
  publications: PUBLICATIONS_QUERY_RESULT;
  currentPage: number;
  hasMore: boolean;
  locale: Locale;
};

const Publications = async ({ publications, currentPage, hasMore }: PublicationsProps) => {
  const t = await getTranslations("publications");

  return (
    <Container as="main">
      <CollectionPageHeader title={t("title")} />
      {!!publications?.length && (
        <CollectionPageList className="mt-10">
          {publications.map((p) => {
            const pLogoUrl = p.cover ? urlFor(p.cover)?.width(413).height(232).url() : null;

            return (
              <li key={p._id}>
                <Link href={p.url} target="_blanc">
                  <PostCard page="publications" title={p.title} imageSrc={pLogoUrl ?? ""} alt={p.cover.alt} />
                </Link>
              </li>
            );
          })}
        </CollectionPageList>
      )}

      {hasMore && <LoadMoreButton currentPage={currentPage} />}

      <CtaLg variant="get-started" className="mt-35 md:mt-40" />
    </Container>
  );
};

export default Publications;
