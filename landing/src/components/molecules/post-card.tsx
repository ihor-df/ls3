import { cn } from "@/lib/utils";
import { ARTICLES_QUERY_RESULT } from "@/sanity/sanity.types";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { ComponentProps } from "react";
import Tag from "../atoms/tag";

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
        className="aspect-413/232 h-auto w-full rounded-[20px] border border-white/10"
        quality={100}
        src={imageSrc}
        alt="Post cover"
        width={350}
        height={196}
        loading="eager" // will change
      />

      {description && <h2 className="mt-5 text-xl leading-[1.2] font-medium md:text-2xl">{description}</h2>}

      <div className="mt-5 flex items-center gap-3 text-sm font-medium">
        <ul className="flex gap-3">
          {categories.map((c) => (
            <Tag as="li" key={c._id}>
              {c.title}
            </Tag>
          ))}
        </ul>

        {date && <p className="text-white/60">{date}</p>}
      </div>
    </div>
  );
};

export default PostCard;
