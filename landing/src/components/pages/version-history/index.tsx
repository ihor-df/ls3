import CollectionPageHeader from "@/components/atoms/collection-page-header";
import Container from "@/components/atoms/container";
import CollectionPageList from "@/components/molecules/collection-page-list";
import { VERSIONS_QUERY_RESULT } from "@/sanity/sanity.types";

type VersionHistoryPageProps = {
  versions: VERSIONS_QUERY_RESULT;
  title: string;
};

const VersionHistoryPage = async ({ versions, title }: VersionHistoryPageProps) => {
  // const t = await getTranslations("versionHistory");

  return (
    <Container as="main">
      <CollectionPageHeader title={title} searchValue={""} />

      {!!versions?.length && (
        <CollectionPageList>
          {versions.map((v, i) => {
            // const postImageUrl = v?.image ? urlFor(v.image)?.width(820).height(462).url() : null;

            return <li key={v._id}>{v.title}</li>;
          })}
        </CollectionPageList>
      )}
    </Container>
  );
};

export default VersionHistoryPage;
