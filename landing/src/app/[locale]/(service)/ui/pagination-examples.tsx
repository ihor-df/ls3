"use client";

import PagePagination from "@/components/molecules/page-pagination";
import { useState } from "react";

const PaginationExamples = () => {
  const [page, setPage] = useState(10);

  return (
    <div className="flex flex-col gap-10">
      <h2 className="text-2xl">Pagination</h2>

      {[
        { title: "Links: first page", currentPage: 1 },
        { title: "Links: middle page", currentPage: 10 },
        { title: "Links: last page", currentPage: 20 },
      ].map(({ title, currentPage }) => (
        <section aria-label={title} key={title} className="flex flex-col gap-4">
          <h3>{title}</h3>
          <PagePagination currentPage={currentPage} pageCount={20} basePath="/blog" />
        </section>
      ))}

      <section aria-label="Search pagination" className="flex flex-col gap-4">
        <h3>Search pagination</h3>
        <PagePagination currentPage={page} pageCount={20} onPageChange={setPage} />
      </section>

      <section aria-label="Disabled pagination" className="flex flex-col gap-4">
        <h3>Disabled pagination</h3>
        <PagePagination currentPage={page} pageCount={20} onPageChange={setPage} disabled />
      </section>
    </div>
  );
};

export default PaginationExamples;
