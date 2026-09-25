import PublicationsPage from "@/components/pages/publications";
import { PUBLICATIONS_PER_PAGE, SANITY_REVALIDATE_TIME } from "@/lib/constants";
import { sanityFetch } from "@/sanity/client";
import { PUBLICATIONS_QUERY_RESULT } from "@/sanity/sanity.types";
import { LocaleParams } from "@/types/common";
import { getPublicationsQuery } from "./api";

type PageProps = {
  params: LocaleParams;
  searchParams: Promise<{ page?: string }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  // const t = await getTranslations("publications");

  const parsedPage = Number(pageParam ?? "1");
  const page = parsedPage > 0 ? parsedPage : 1;
  const limit = page * PUBLICATIONS_PER_PAGE;

  const [publicationsWithExtra] = await Promise.all([
    sanityFetch({
      params: { locale },
      query: getPublicationsQuery(limit + 1),
      revalidate: SANITY_REVALIDATE_TIME,
    }) as Promise<PUBLICATIONS_QUERY_RESULT>,
  ]);

  const hasMore = publicationsWithExtra.length > limit;
  const publications = publicationsWithExtra.slice(0, limit);

  return <PublicationsPage locale={locale} publications={publications ?? []} currentPage={page} hasMore={hasMore} />;
}
