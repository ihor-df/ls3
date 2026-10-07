export const PARTNERS_SEARCH_MAX_LENGTH = 200;

export const isPartnersListingPath = (pathname: string) =>
  /^\/partners(?:\/page\/[1-9]\d*|\/category\/[^/]+(?:\/page\/[1-9]\d*)?)?$/.test(pathname);
