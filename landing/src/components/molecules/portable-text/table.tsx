import { cn } from "@/lib/utils";
import { Table } from "@/sanity/sanity.types";
import { PortableText, PortableTextBlock, PortableTextComponents } from "next-sanity";

type ArticleTable = {
  headerRows?: number;
  rows?: Array<{
    _key: string;
    cells?: Array<{
      _key: string;
      value?: PortableTextBlock[];
    }>;
  }>;
};

type ArticleTableRow = NonNullable<Table["rows"]>[number];

const tableCellComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <>{children}</>,
  },
};

export const ArticleTable = ({ value }: { value: unknown }) => {
  const table = value as Table;
  const rows = table.rows ?? [];
  const headerRows = table.headerRows ?? 0;

  const renderRow = (row: ArticleTableRow, isHeader: boolean, isLast: boolean) => (
    <tr className="" key={row._key}>
      {row.cells?.map((cell) => {
        const Cell = isHeader ? "th" : "td";

        return (
          <Cell
            key={cell._key}
            className={cn(
              "border-r border-white/10 p-5 text-base last:border-r-0",
              !isLast && "border-b",
              isHeader ? "bg-[#19191A] py-7 text-left font-bold text-white md:text-xl" : "align-top",
            )}
          >
            <PortableText value={cell.value ?? []} components={tableCellComponents} />
          </Cell>
        );
      })}
    </tr>
  );

  return (
    <div className="rounded-small my-5 overflow-hidden border border-white/10 md:my-6">
      <div className="custom-scrollbar overflow-x-auto">
        <table className="w-full min-w-190 border-collapse text-sm">
          {headerRows > 0 && (
            <thead>
              {rows.slice(0, headerRows).map((row, index) => renderRow(row, true, index === rows.length - 1))}
            </thead>
          )}

          <tbody>
            {rows.slice(headerRows).map((row, index, bodyRows) => renderRow(row, false, index === bodyRows.length - 1))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
