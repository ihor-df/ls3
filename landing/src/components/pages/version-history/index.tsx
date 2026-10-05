import CollectionPageHeader from "@/components/atoms/collection-page-header";
import Container from "@/components/atoms/container";
import { VERSION_HISTORY_QUERY_RESULT } from "@/sanity/sanity.types";
import type { Locale } from "next-intl";
import { Suspense } from "react";
import VersionHistoryContent from "./content";
import { buildVersionHistoryData } from "./data";

type VersionHistoryPageProps = {
  versions: VERSION_HISTORY_QUERY_RESULT["versions"];
  title: string;
  locale: Locale;
  noResults: string;
};

const VersionHistoryPage = ({ versions, title, locale, noResults }: VersionHistoryPageProps) => {
  const versionHistoryData = buildVersionHistoryData(versions, locale);

  return (
    <Container as="main">
      <CollectionPageHeader title={title} searchValue="" searchNavigationMode="history" />
      <Suspense fallback={null}>
        <VersionHistoryContent
          locale={locale}
          noResults={noResults}
          versions={versionHistoryData.versions}
          periods={versionHistoryData.periods}
        />
      </Suspense>
    </Container>
  );
};

export default VersionHistoryPage;
