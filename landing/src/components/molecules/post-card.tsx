"use client";

import { ARTICLES_QUERY_RESULT, PARTNERS_QUERY_RESULT } from "@/sanity/sanity.types";
import orange from "@public/images/orange-cloud-bg.webp";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { ComponentProps } from "react";
import CategoryAndDate from "./category-date";

type Categories =
  NonNullable<ARTICLES_QUERY_RESULT[number]["categories"]> | NonNullable<PARTNERS_QUERY_RESULT[number]["categories"]>;

type PostCardProps = ComponentProps<"div"> & {
  imageSrc: string | StaticImport;
  title: string;
  description?: string;
  date?: string;
  categories: Categories;
  page: "blog" | "partners";
  alt?: string;
};

const PostCard = ({ imageSrc, title, description, className, categories, page, alt }: PostCardProps) => {
  const isPartners = page === "partners";

  return (
    <div className={className}>
      <Image
        style={{ backgroundImage: isPartners ? `url(${orange.src})` : undefined }}
        className="rounded-small aspect-413/232 h-auto w-full border border-white/10 bg-cover bg-center"
        quality={100}
        src={imageSrc}
        alt={alt ?? ""}
        width={350}
        height={196}
        loading="eager"
      />

      {title && <h2 className="mt-5 text-xl leading-[1.2] md:text-2xl">{title}</h2>}
      {description && (
        <p className="mt-5 line-clamp-4 leading-[1.2] tracking-[-0.01em] text-[#C3C3C3]">{description}</p>
      )}

      <CategoryAndDate page={page} categories={categories} className="mt-5" />
    </div>
  );
};

export default PostCard;
