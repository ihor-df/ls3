import { cn } from "@/lib/utils";
import { CATEGORIES_QUERY_RESULT } from "@/sanity/sanity.types";
import Tag from "../atoms/tag";

type CategoryAndDateProps = {
  categories: CATEGORIES_QUERY_RESULT;
  date?: string;
  className?: string;
  linked?: boolean;
};

const CategoryAndDate = ({ categories, date, className, linked }: CategoryAndDateProps) => {
  return (
    <div className={cn("flex items-center gap-3 text-sm", className)}>
      <ul className="flex gap-3">
        {categories?.map((c) => (
          <li key={c._id}>
            <Tag href={linked ? `/blog/category/${c.slug}` : undefined}>{c.title}</Tag>
          </li>
        ))}
      </ul>
      {date && <p className="text-white/60">{date}</p>}
    </div>
  );
};

export default CategoryAndDate;
