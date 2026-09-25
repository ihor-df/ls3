"use client";

import { cn } from "@/lib/utils";
import { Categories } from "@/types/common";
import orange from "@public/images/orange-cloud-bg.webp";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { ComponentProps } from "react";
import PlayButton from "../atoms/play-button";
import CategoryAndDate from "./category-date";

type PostCardProps = ComponentProps<"div"> & {
  imageSrc: string | StaticImport;
  title: string;
  description?: string;
  date?: string;
  categories?: Categories;
  page: "blog" | "partners" | "publications" | "guide-videos";
  alt?: string;
  videoUrl?: string;
};

const PostCard = ({ imageSrc, title, description, className, categories, page, alt, videoUrl }: PostCardProps) => {
  const isPartners = page === "partners";

  return (
    <div className={cn("transition-opacity duration-300 hover:opacity-70", className)}>
      <div className="relative">
        <Image
          style={{ backgroundImage: isPartners ? `url(${orange.src})` : undefined }}
          className="rounded-small aspect-413/232 h-auto w-full border border-white/10 bg-cover bg-center"
          src={imageSrc}
          alt={alt ?? ""}
          width={350}
          height={196}
          loading="eager"
          quality={100}
        />
        {videoUrl && <PlayButton href={videoUrl} />}
      </div>

      {title && <h2 className="mt-5 text-xl leading-[1.2] md:text-2xl">{title}</h2>}
      {description && (
        <p className="mt-5 line-clamp-4 leading-[1.2] tracking-[-0.01em] text-[#C3C3C3]">{description}</p>
      )}

      {page !== "publications" && categories && (
        <CategoryAndDate page={page} categories={categories} className="mt-5" />
      )}
    </div>
  );
};

export default PostCard;
