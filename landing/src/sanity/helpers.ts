import { client } from "@/sanity/client";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

const { projectId, dataset } = client.config();

export const urlFor = (source: SanityImageSource) =>
  projectId && dataset ? createImageUrlBuilder({ projectId, dataset }).image(source) : null;
