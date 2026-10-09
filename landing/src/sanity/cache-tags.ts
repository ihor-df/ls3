// Requests and webhook rules share these factories, including queries that return null.
export const sanityTags = {
  article: (locale: string, slug: string) => `article:${locale}:${slug}`,
  partner: (locale: string, slug: string) => `partner:${locale}:${slug}`,
  page: (locale: string, slug: string) => `page:${locale}:${slug}`,
  blogList: (locale: string) => `blog:list:${locale}`,
  partnersList: (locale: string) => `partners:list:${locale}`,
  publications: (locale: string) => `publications:${locale}`,
  versionHistory: (locale: string) => `version-history:${locale}`,
  articleCategories: "article-categories",
  partnerCategories: "partner-categories",
  articleAuthors: "article-authors",
  languageNavigation: "language-navigation",
};
