import Container from "@/components/atoms/container";
import CollectionPageHeader from "@/components/molecules/collection-page-header";
import { VERSION_HISTORY_QUERY_RESULT } from "@/sanity/sanity.types";
import type { Locale } from "next-intl";
import Content from "./content";
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
    <Container as="main" className="lg:py-0">
      <Content
        header={
          <CollectionPageHeader
            title={title}
            initialSearchValue=""
            searchNavigationMode="history"
            searchClassName="max-lg:hidden"
            className="lg:bg-background lg:pointer-events-auto lg:pt-40 lg:pb-10"
          />
        }
        locale={locale}
        noResults={noResults}
        versions={versionHistoryData.versions}
        periods={versionHistoryData.periods}
      />
    </Container>
  );
};

export default VersionHistoryPage;
