export const PRODUCTION_DOMAIN = "ls3x.vercel.app";
export const ARTICLES_PER_PAGE = 1;
export const PARTNERS_PER_PAGE = 1;
export const PUBLICATIONS_PER_PAGE = 1;

export const INDEX_FOLLOW_ROBOTS = {
  index: true,
  follow: true,
} as const;

export const NO_INDEX_FOLLOW_ROBOTS = {
  index: false,
  follow: true,
} as const;

export const NO_INDEX_NO_FOLLOW_ROBOTS = {
  index: false,
  follow: false,
} as const;
