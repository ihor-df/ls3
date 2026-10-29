import CtaLg from "@/components/organisms/cta-blocks/cta-lg";
import PartnersPage from "@/components/pages/partners";
import type { Locale } from "next-intl";
import { notFound } from "next/navigation";
import { getPartnerCategories, getPartnersData } from "./data";

type PartnersListingProps = {
  locale: Locale;
  page: number;
  categorySlug?: string;
  title: string;
};

export async function PartnersListing({ locale, page, categorySlug, title }: PartnersListingProps) {
  const categories = await getPartnerCategories(locale);
  const category = categorySlug ? categories.find(({ slug }) => slug === categorySlug) : undefined;

  if (categorySlug && !category) notFound();
  const { partners, pageCount } = await getPartnersData(locale, { page, categoryId: category?._id });
  if (page > Math.max(1, pageCount) || (category && !partners.length)) notFound();

  return (
    <PartnersPage
      partners={partners}
      categories={categories}
      currentPage={page}
      pageCount={pageCount}
      paginationBasePath={category ? `/partners/category/${category.slug}` : "/partners"}
      activeCategory={category?.slug ?? null}
      title={category?.title ?? title}
    >
      {/* server content as children */}
      <div className="mt-35 grid grid-cols-1 gap-5 md:mt-40 md:gap-10 xl:grid-cols-2">
        <CtaLg
          className="mt-0! md:[&>div>strong]:text-[2.5rem] md:[&>div>strong]:tracking-[-0.03em]"
          variant="become-partner"
        />
        <CtaLg
          className="mt-0! md:[&>div>strong]:text-[2.5rem] md:[&>div>strong]:tracking-[-0.03em]"
          variant="get-started"
        />
      </div>
    </PartnersPage>
  );
}
