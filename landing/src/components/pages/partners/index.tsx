"use client";

import Container from "@/components/atoms/container";
import CollectionPageHeader from "@/components/molecules/collection-page-header";
import CollectionPageList from "@/components/molecules/collection-page-list";
import PagePagination from "@/components/molecules/page-pagination";
import PostCard from "@/components/molecules/post-card";
import { usePartnersSearch } from "@/context/partners-search-provider";
import { Link } from "@/i18n/navigation";
import { PARTNERS_SEARCH_MAX_LENGTH } from "@/lib/partners-search";
import { imageBuilder } from "@/sanity/helpers";
import type { PARTNER_CATEGORIES_QUERY_RESULT, PARTNERS_QUERY_RESULT } from "@/sanity/sanity.types";
import CategoryFilters from "@components/molecules/category-filters";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

type PartnersPageProps = {
  partners: PARTNERS_QUERY_RESULT;
  categories: PARTNER_CATEGORIES_QUERY_RESULT;
  currentPage: number;
  pageCount: number;
  paginationBasePath: string;
  activeCategory: string | null;
  title: string;
  children: ReactNode;
};

const PartnersPage = ({
  partners,
  categories,
  currentPage,
  pageCount,
  paginationBasePath,
  activeCategory,
  title,
  children,
}: PartnersPageProps) => {
  const t = useTranslations("partners");
  const { query, result, status, search } = usePartnersSearch();

  const visiblePartners = (result?.partners ?? partners).map((partner) => ({
    id: partner._id,
    title: partner.title,
    description: partner.description ?? "",
    href: `/partners/${partner.slug.current}`,
    imageSrc: partner.logo ? (imageBuilder(partner.logo)?.width(413).height(232).url() ?? "") : "",
    alt: partner.logo?.alt ?? "",
    categories: partner.categories ?? [],
  }));

  const searchMessage =
    status === "error" ? t("search.error") : result && !result.partners.length ? t("search.empty") : undefined;

  return (
    <Container as="main">
      <CollectionPageHeader
        title={title}
        initialSearchValue=""
        searchClassName="max-lg:hidden"
        searchMaxLength={PARTNERS_SEARCH_MAX_LENGTH}
      />
      <CategoryFilters
        className="mt-10"
        allLabel={t("allLabel")}
        page="partners"
        categories={categories}
        activeCategory={activeCategory}
      />

      <section aria-label={query ? t("search.label") : undefined} aria-busy={status === "loading"}>
        {searchMessage && (
          <p role="status" aria-live="polite" className="text-light-grey mt-10 text-center">
            {searchMessage}
          </p>
        )}

        {visiblePartners.length > 0 && (
          <CollectionPageList>
            {visiblePartners.map(({ id, href, ...partner }) => (
              <li key={id}>
                <Link href={href}>
                  <PostCard page="partners" {...partner} />
                </Link>
              </li>
            ))}
          </CollectionPageList>
        )}

        {visiblePartners.length > 0 &&
          (result ? (
            <PagePagination
              className="mt-16 md:mt-40"
              currentPage={result.page}
              pageCount={result.pageCount}
              disabled={status === "loading"}
              onPageChange={(nextPage) => void search(result.query, nextPage)}
            />
          ) : (
            <PagePagination
              className="mt-16 md:mt-40"
              basePath={paginationBasePath}
              currentPage={currentPage}
              pageCount={pageCount}
            />
          ))}
      </section>

      {children}
    </Container>
  );
};

export default PartnersPage;
