import { Categories } from "@/types/common";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { ComponentProps } from "react";
import PlayButton from "../atoms/play-button";
import CategoryAndDate from "./category-date";

type VideoPostCardProps = ComponentProps<"div"> & {
  imageSrc: string | StaticImport;
  title: string;
  categories?: Categories;
  alt?: string;
  onPlay: () => void;
  playLabel: string;
};

const VideoPostCard = ({ imageSrc, title, categories, className, alt, onPlay, playLabel }: VideoPostCardProps) => {
  return (
    <div className={className}>
      <div className="group relative">
        <Image
          className="rounded-small aspect-413/232 h-auto w-full border border-white/10 bg-cover bg-center transition-opacity duration-300 group-hover:opacity-70"
          src={imageSrc}
          alt={alt ?? ""}
          width={350}
          height={196}
          loading="eager"
          quality={100}
        />
        <PlayButton
          className="transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100"
          label={playLabel}
          onClick={onPlay}
        />
      </div>

      {title && <h2 className="mt-5 text-xl leading-[1.2] md:text-2xl">{title}</h2>}
      {categories && <CategoryAndDate categories={categories} className="mt-5" />}
    </div>
  );
};

export default VideoPostCard;
