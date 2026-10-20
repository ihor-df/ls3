export const SITE_NAME = "Linken Sphere";
export const PRODUCTION_DOMAIN = "ls3x.vercel.app";
export const DEFAULT_OG_IMAGE_URL = "https://ls.app/images/thumbnail-for-sharing.webp";

export const ARTICLES_PER_PAGE = 1;
export const PARTNERS_PER_PAGE = 1;
export const PUBLICATIONS_PER_PAGE = 1;

export const INDEX_FOLLOW_ROBOTS = {
  index: true,
  follow: true,
} as const;

export const NO_INDEX_FOLLOW_ROBOTS = {
  index: false,
  follow: false, // TODO: true
} as const;

export const NO_INDEX_NO_FOLLOW_ROBOTS = {
  index: false,
  follow: false,
} as const;
