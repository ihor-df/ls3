"use client";

import { isGuideVideoCategorySlug, type GuideVideoCategorySlug } from "@/app/[locale]/(service)/guide-videos/constants";
import CollectionPageHeader from "@/components/atoms/collection-page-header";
import Container from "@/components/atoms/container";
import CategoryFilters from "@/components/molecules/category-filters";
import PostCard from "@/components/molecules/post-card";
import useHashCategory from "@/hooks/useHashCategory";
import { useTranslations } from "next-intl";
import { StaticImageData } from "next/image";

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

  const t = useTranslations("guideVideos");

  const visibleVideos = activeCategory ? videos.filter((video) => video.category === activeCategory) : videos;

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
            <PostCard
              title={title}
              page="guide-videos"
              imageSrc={imageSrc}
              categories={[{ _id: category, title: categoryTitle }]}
              videoUrl={"https://www.youtube.com/watch?v=" + videoId}
            />
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default GuideVideosPage;
