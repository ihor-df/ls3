import LoadMoreButton from "@/components/molecules/load-more-button";
import PostCard from "@/components/molecules/post-card";
import Cta from "@/components/organisms/cta";
import { Link } from "@/i18n/navigation";
import { urlFor } from "@/sanity/helpers";
import type { PARTNER_CATEGORIES_QUERY_RESULT, PARTNERS_QUERY_RESULT } from "@/sanity/sanity.types";
import { Locale } from "next-intl";
import CategoryFilters from "../../molecules/category-filters";

type PartnersProps = {
  partners: PARTNERS_QUERY_RESULT;
  categories: PARTNER_CATEGORIES_QUERY_RESULT;
  currentPage: number;
  hasMore: boolean;
  locale: Locale;
};

const Partners = ({ partners, categories, currentPage, hasMore }: PartnersProps) => {
  return (
    <div className="mt-10 flex flex-col">
      <CategoryFilters page="partners" categories={categories} />

      {!!partners?.length ? (
        <ul className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-2 md:gap-x-5 md:gap-y-16 xl:grid-cols-3">
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
        </ul>
      ) : (
        <div className="flex h-100 items-center justify-center text-lg text-[#C3C3C3]">
          <p>No partners :(</p>
        </div>
      )}

      {hasMore && <LoadMoreButton currentPage={currentPage} />}

      <Cta size="lg" className="mt-35 md:mt-40" />
    </div>
  );
};

export default Partners;
