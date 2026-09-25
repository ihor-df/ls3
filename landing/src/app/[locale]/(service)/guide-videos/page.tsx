import GuideVideosPage from "@/components/pages/guide-videos";
import { routing } from "@/i18n/routing";
import type { LocaleParams } from "@/types/common";
import { getTranslations } from "next-intl/server";
import { GUIDE_VIDEO_CATEGORY_SLUGS, GUIDE_VIDEOS } from "./constants";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Page({ params }: { params: LocaleParams }) {
  const { locale } = await params;
  const t = await getTranslations("guideVideos");
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

  return <GuideVideosPage categories={categories} videos={videos} />;
}
