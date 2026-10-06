import Container from "@/components/atoms/container";
import CollectionPageHeader from "@/components/system/collection-page-header";
import { VERSION_HISTORY_QUERY_RESULT } from "@/sanity/sanity.types";
import type { Locale } from "next-intl";
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
      <CollectionPageHeader
        title={title}
        initialSearchValue=""
        searchNavigationMode="history"
        searchClassName="max-lg:hidden"
      />
      <VersionHistoryContent
        locale={locale}
        noResults={noResults}
        versions={versionHistoryData.versions}
        periods={versionHistoryData.periods}
      />
    </Container>
  );
};

export default VersionHistoryPage;
