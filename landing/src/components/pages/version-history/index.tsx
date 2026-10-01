import CollectionPageHeader from "@/components/atoms/collection-page-header";
import Container from "@/components/atoms/container";
import { formatDate } from "@/lib/utils";
import { urlFor } from "@/sanity/helpers";
import { VERSION_HISTORY_QUERY_RESULT } from "@/sanity/sanity.types";
import { getFormatter, getLocale } from "next-intl/server";
import MonthPicker from "./month-picker";
import VersionCard from "./version-card";

type VersionHistoryPageProps = {
  versions: VERSION_HISTORY_QUERY_RESULT["versions"];
  title: string;
};

const VersionHistoryPage = async ({ versions, title }: VersionHistoryPageProps) => {
  // const t = await getTranslations("versionHistory");
  const [format, locale] = await Promise.all([getFormatter(), getLocale()]);

  return (
    <Container as="main">
      <CollectionPageHeader title={title} searchValue="" />

      <div className="mt-10 grid flex-1 grid-cols-1 gap-10 lg:grid-cols-[300px_1fr]">
        <MonthPicker />

        {!!versions?.length && (
          <ul>
            {versions.map((v) => {
              const postImageUrl = v?.cover ? urlFor(v.cover)?.url() : null;
              const releaseDate = new Date(v.releaseDate);
              const formattedReleaseDate = formatDate(v.releaseDate, locale, { month: "long" });
              const month = format.dateTime(releaseDate, {
                month: "long",
                timeZone: "UTC",
              });

              return (
                <VersionCard
                  releaseType={v.releaseType}
                  key={v._id}
                  version={v.version}
                  imageUrl={postImageUrl}
                  body={v.body}
                  releaseDate={formattedReleaseDate}
                />
              );
            })}
          </ul>
        )}
      </div>
    </Container>
  );
};

export default VersionHistoryPage;
