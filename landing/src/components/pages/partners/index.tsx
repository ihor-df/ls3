import CollectionPageList from "@/components/molecules/collection-page-list";
import LoadMoreButton from "@/components/molecules/load-more-button";
import PostCard from "@/components/molecules/post-card";
import CtaLg from "@/components/organisms/cta-lg";
import { Link } from "@/i18n/navigation";
import { urlFor } from "@/sanity/helpers";
import type { PARTNER_CATEGORIES_QUERY_RESULT, PARTNERS_QUERY_RESULT } from "@/sanity/sanity.types";
import CategoryFilters from "@components/molecules/category-filters";
import { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";

type PartnersPageProps = {
  partners: PARTNERS_QUERY_RESULT;
  categories: PARTNER_CATEGORIES_QUERY_RESULT;
  currentPage: number;
  hasMore: boolean;
  locale: Locale;
};

const PartnersPage = async ({ partners, categories, currentPage, hasMore }: PartnersPageProps) => {
  const t = await getTranslations("partners");

  return (
    <div className="mt-10 flex flex-col">
      <CategoryFilters allLabel={t("allLabel")} page="partners" categories={categories} />

      {!!partners?.length && (
        <CollectionPageList>
          {partners.map((partner) => {
            const partnerLogoUrl = partner.logo ? urlFor(partner.logo)?.width(413).height(232).url() : null;

            return (
              <li key={partner._id}>
                <Link href={`/partners/${partner.slug?.current}`}>
                  <PostCard
                    page="partners"
                    title={partner.title}
                    description={partner.description ?? ""}
                    imageSrc={partnerLogoUrl ?? ""}
                    categories={partner.categories}
                    alt={partner.logo.alt}
                  />
                </Link>
              </li>
            );
          })}
        </CollectionPageList>
      )}

      {hasMore && <LoadMoreButton currentPage={currentPage} />}

      <div className="mt-35 grid grid-cols-1 gap-5 md:mt-40 md:gap-10 xl:grid-cols-2">
        <CtaLg
          className="md:[&>div>strong]:text-[2.5rem] md:[&>div>strong]:tracking-[-0.03em]"
          variant="become-partner"
        />
        <CtaLg className="md:[&>div>strong]:text-[2.5rem] md:[&>div>strong]:tracking-[-0.03em]" variant="get-started" />
      </div>
    </div>
  );
};

export default PartnersPage;
