import CollectionPageList from "@/components/molecules/collection-page-list";
import LoadMoreButton from "@/components/molecules/load-more-button";
import PostCard from "@/components/molecules/post-card";
import { Link } from "@/i18n/navigation";
import { urlFor } from "@/sanity/helpers";
import type { PARTNERS_QUERY_RESULT } from "@/sanity/sanity.types";
import { Locale } from "next-intl";

type PublicationsProps = {
  publications: PARTNERS_QUERY_RESULT;
  currentPage: number;
  hasMore: boolean;
  locale: Locale;
};

const Publications = ({ publications, currentPage, hasMore }: PublicationsProps) => {
  return (
    <div className="mt-10 flex flex-col">
      {!!publications?.length && (
        <CollectionPageList>
          {publications.map((p) => {
            const pLogoUrl = p.logo ? urlFor(p.logo)?.width(413).height(232).url() : null;

            return (
              <li key={p._id}>
                <Link href={`/publications/${p.slug?.current}`}>
                  <PostCard
                    page="publications"
                    title={p.title}
                    description={p.description ?? ""}
                    imageSrc={pLogoUrl ?? ""}
                    categories={p.categories}
                    alt={p.logo.alt}
                  />
                </Link>
              </li>
            );
          })}
        </CollectionPageList>
      )}

      {hasMore && <LoadMoreButton currentPage={currentPage} />}
    </div>
  );
};

export default Publications;
