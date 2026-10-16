import { DEFAULT_OG_IMAGE_URL } from "@/lib/constants";
import { imageBuilder } from "@/sanity/helpers";
import type { Seo } from "@/sanity/sanity.types";

export function getSocialImage(ogImage?: Seo["ogImage"] | null) {
  const imageUrl = ogImage?.asset ? imageBuilder(ogImage?.asset)?.width(1200).height(630).fit("crop").url() : undefined;

  return {
    url: imageUrl ?? DEFAULT_OG_IMAGE_URL,
    width: 1200,
    height: 630,
  };
}
