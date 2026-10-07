import { client } from "@/sanity/client";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

const { projectId, dataset } = client.config();

export const imageBuilder = (source: SanityImageSource) =>
  projectId && dataset ? createImageUrlBuilder({ projectId, dataset }).image(source) : null;
