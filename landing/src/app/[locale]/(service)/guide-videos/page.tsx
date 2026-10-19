import GuideVideosPage from "@/components/pages/guide-videos";
import { generatePageMetadata } from "@/helpers/metadata/generate-page-metadata";
import { routing } from "@/i18n/routing";
import type { LocalePageProps, LocaleParams } from "@/types/common";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPageQuery } from "../../api";
import { GUIDE_VIDEO_CATEGORY_SLUGS, GUIDE_VIDEOS } from "./constants";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const data = await getPageQuery("guide-videos", locale);

  return generatePageMetadata({
    locale,
    pathname: "/guide-videos",
    title: data?.seo?.title,
    description: data?.seo?.description,
    ogImage: data?.seo?.ogImage,
    noIndex: !!data?.seo?.noIndex,
  });
}

export default async function Page({ params }: { params: LocaleParams }) {
  const { locale } = await params;

  const t = await getTranslations("guideVideos");
  const data = await getPageQuery("guide-videos", locale);
  const useRussianVideos = locale === "ru" || locale === "uk";

  const categories = GUIDE_VIDEO_CATEGORY_SLUGS.map((slug) => ({
    _id: slug,
    slug,
    title: t(`categories.${slug}`),
  }));

  const videos = GUIDE_VIDEOS.map((video) => {
    const videoId = useRussianVideos && "ruVideoId" in video ? video.ruVideoId : video.videoId;

    return {
      id: video.id,
      category: video.category,
      categoryTitle: t(`categories.${video.category}`),
      title: t(`videos.${video.id}`),
      imageSrc: video.cover,
      videoId,
    };
  });

  return <GuideVideosPage title={data?.mainTitle || t("title")} categories={categories} videos={videos} />;
}
