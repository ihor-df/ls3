import CollectionPageHeader from "@/components/atoms/collection-page-header";
import Container from "@/components/atoms/container";
import { VERSION_HISTORY_QUERY_RESULT } from "@/sanity/sanity.types";
import VersionCard from "./version-card";

type VersionHistoryPageProps = {
  versions: VERSION_HISTORY_QUERY_RESULT["versions"];
  title: string;
};

const VersionHistoryPage = async ({ versions, title }: VersionHistoryPageProps) => {
  // const t = await getTranslations("versionHistory");

  return (
    <Container as="main">
      <CollectionPageHeader title={title} searchValue="" />

      <div className="mt-10 grid flex-1 grid-cols-1 gap-10 lg:grid-cols-[300px_1fr]">
        <div className="bg-dark-grey lg:rounded-large rounded-full p-3 pr-4 lg:pr-1.5"></div>

        {!!versions?.length && (
          <ul>
            {versions.map((v) => {
              // const postImageUrl = v?.image ? urlFor(v.image)?.width(820).height(462).url() : null;

              return <VersionCard key={v._id} />;
            })}
          </ul>
        )}
      </div>
    </Container>
  );
};

export default VersionHistoryPage;
