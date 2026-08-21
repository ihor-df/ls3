import { cn } from "@/lib/utils";
import { ARTICLES_QUERY_RESULT } from "@/sanity/sanity.types";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { ComponentProps } from "react";
import CategoryAndDate from "./category-date";

type PostCardProps = ComponentProps<"div"> & {
  imageSrc: string | StaticImport;
  description: string;
  date?: string;
  categories: NonNullable<ARTICLES_QUERY_RESULT[number]["categories"]>;
};

const PostCard = ({ imageSrc, description, className, date, categories }: PostCardProps) => {
  return (
    <div className={cn(className)}>
      <Image
        className="rounded-small aspect-413/232 h-auto w-full border border-white/10"
        quality={100}
        src={imageSrc}
        alt="Post cover"
        width={350}
        height={196}
        loading="eager"
      />

      {description && <h2 className="mt-5 text-xl leading-[1.2] md:text-2xl">{description}</h2>}

      <CategoryAndDate categories={categories} date={date} className="mt-5" />
    </div>
  );
};

export default PostCard;
