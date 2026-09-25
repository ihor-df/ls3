import { cn } from "@/lib/utils";
import { Categories } from "@/types/common";
import Tag from "../atoms/tag";

type CategoryAndDateProps = {
  categories: Categories;
  date?: string;
  className?: string;
  linked?: boolean;
  page: "blog" | "partners" | "guide-videos";
};

const CategoryAndDate = ({ categories, date, className, linked, page }: CategoryAndDateProps) => {
  return (
    <div className={cn("flex items-center gap-3 text-sm", className)}>
      <ul className="flex gap-3">
        {categories?.map((c) => (
          <li key={c._id}>
            <Tag href={linked ? `/${page}/category/${c.slug}` : undefined}>{c.title}</Tag>
          </li>
        ))}
      </ul>
      {date && <p className="text-white/60">{date}</p>}
    </div>
  );
};

export default CategoryAndDate;
