"use client";

import { isGuideVideoCategorySlug, type GuideVideoCategorySlug } from "@/app/[locale]/(service)/guide-videos/constants";
import Container from "@/components/atoms/container";
import CategoryFilters from "@/components/molecules/category-filters";
import VideoModal from "@/components/molecules/video-modal";
import VideoPostCard from "@/components/molecules/video-post-card";
import CollectionPageHeader from "@/components/organisms/collection-page-header";
import CtaLg from "@/components/organisms/cta/cta-lg";
import useHashCategory from "@/hooks/useHashCategory";
import { useTranslations } from "next-intl";
import { StaticImageData } from "next/image";
import { useState } from "react";

type GuideVideosPageProps = {
  categories: { _id: string; slug: GuideVideoCategorySlug; title: string }[];
  videos: {
    id: string;
    category: GuideVideoCategorySlug;
    categoryTitle: string;
    title: string;
    videoId: string;
    imageSrc: StaticImageData;
  }[];
};

const GuideVideosPage = ({ categories, videos }: GuideVideosPageProps) => {
  const [activeCategory, handleCategoryChange] = useHashCategory(isGuideVideoCategorySlug);
  const [activeVideo, setActiveVideo] = useState<{ videoId: string; title: string } | null>(null);

  const t = useTranslations("guideVideos");
  const visibleVideos = activeCategory ? videos.filter((video) => video.category === activeCategory) : videos;

  const openVideo = (videoId: string, title: string) => {
    setActiveVideo({ videoId, title });
  };

  return (
    <Container as="main">
      <div className="flex items-center justify-between gap-5">
        <CollectionPageHeader title={t("title")} />
        <span className="text-[3.5rem] leading-none font-bold max-md:hidden">({visibleVideos.length})</span>
      </div>

      <div className="mt-10 flex flex-col">
        <CategoryFilters
          page="guide-videos"
          allLabel={t("allVideos")}
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      <ul className="mt-10 grid gap-8 md:mt-16 md:grid-cols-2 xl:grid-cols-3">
        {visibleVideos.map(({ id, title, category, categoryTitle, imageSrc, videoId }) => (
          <li key={id}>
            <VideoPostCard
              title={title}
              imageSrc={imageSrc}
              categories={[{ _id: category, title: categoryTitle }]}
              onPlay={() => openVideo(videoId, title)}
              playLabel={t("watchVideo", { title })}
            />
          </li>
        ))}
      </ul>

      <CtaLg variant="help" />
      <VideoModal video={activeVideo} closeLabel={t("closeVideo")} onClose={() => setActiveVideo(null)} />
    </Container>
  );
};

export default GuideVideosPage;
