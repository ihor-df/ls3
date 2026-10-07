export const parsePageNumber = (value?: string): number | null => {
  if (value === undefined) return 1;
  if (!/^[1-9]\d*$/.test(value)) return null;

  const page = Number(value);
  return Number.isSafeInteger(page) ? page : null;
};

export const getPageCount = (total: number, pageSize: number) => Math.ceil(total / pageSize);

export const getPageOffset = (page: number, pageSize: number) => (page - 1) * pageSize;

export const getStaticPaginationPages = (total: number, pageSize: number) =>
  Array.from({ length: Math.max(getPageCount(total, pageSize) - 1, 0) }, (_, index) => index + 2);

export const getPaginationPath = (basePath: string, page: number) =>
  page === 1 ? basePath : `${basePath}/page/${page}`;

export const getPaginationItems = (currentPage: number, pageCount: number): Array<number | "ellipsis"> => {
  if (pageCount === 0) return [];

  const windowSize = 3;
  const startPage = Math.max(1, Math.min(currentPage - 1, pageCount - windowSize + 1));
  const endPage = Math.min(pageCount, startPage + windowSize - 1);
  const items: Array<number | "ellipsis"> = [];

  if (startPage > 1) {
    items.push(1);
    if (startPage > 2) items.push("ellipsis");
  }

  for (let page = startPage; page <= endPage; page += 1) {
    items.push(page);
  }

  if (endPage < pageCount) {
    if (endPage < pageCount - 1) items.push("ellipsis");
    items.push(pageCount);
  }

  return items;
};
