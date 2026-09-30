import CollectionPageHeader from "@/components/atoms/collection-page-header";
import Container from "@/components/atoms/container";
import CollectionPageList from "@/components/molecules/collection-page-list";
import { VERSION_HISTORY_QUERY_RESULT } from "@/sanity/sanity.types";

type VersionHistoryPageProps = {
  versions: VERSION_HISTORY_QUERY_RESULT["versions"];
  title: string;
};

const VersionHistoryPage = async ({ versions, title }: VersionHistoryPageProps) => {
  // const t = await getTranslations("versionHistory");

  return (
    <Container as="main">
      <CollectionPageHeader title={title} searchValue={""} />

      {!!versions?.length && (
        <CollectionPageList>
          {versions.map((v) => {
            // const postImageUrl = v?.image ? urlFor(v.image)?.width(820).height(462).url() : null;

            return <li key={v._id}>{v.title}</li>;
          })}
        </CollectionPageList>
      )}
    </Container>
  );
};

export default VersionHistoryPage;
