export const BLOG_SEARCH_MAX_LENGTH = 200;

export const isBlogListingPath = (pathname: string) =>
  /^\/blog(?:\/page\/[1-9]\d*|\/category\/[^/]+(?:\/page\/[1-9]\d*)?)?$/.test(pathname);
