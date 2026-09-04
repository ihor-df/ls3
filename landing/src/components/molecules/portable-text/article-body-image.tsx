import { urlFor } from "@/sanity/helpers";
import { ArticleBodyImage as ArticleBodyImageValue } from "@/sanity/sanity.types";
import { Image } from "next-sanity/image";

export const ArticleBodyImage = ({ value }: { value: ArticleBodyImageValue }) => {
  const imageUrl = value.image ? urlFor(value.image)?.width(820).height(462).url() : null;
  if (!imageUrl) return null;

  return (
    <figure className="my-5 md:my-6">
      <Image
        src={imageUrl}
        alt={value.alt ?? ""}
        width={760}
        height={428}
        className="rounded-small md:rounded-large aspect-350/197 w-full border border-white/10"
      />

      {value.caption && (
        <figcaption className="mt-3 text-center text-sm leading-[1.2] text-white/60">{value.caption}</figcaption>
      )}
    </figure>
  );
};
