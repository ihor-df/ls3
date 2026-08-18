import { cn } from "@/lib/utils";
import { CATEGORIES_QUERY_RESULT } from "@/sanity/sanity.types";
import Tag from "../atoms/tag";

type CategoryDateProps = {
  categories: CATEGORIES_QUERY_RESULT;
  date?: string;
  className?: string;
};

const CategoryDate = ({ categories, date, className }: CategoryDateProps) => {
  return (
    <div className={cn("flex items-center gap-3 text-sm", className)}>
      <ul className="flex gap-3">
        {categories?.map((c) => (
          <Tag as="li" key={c._id}>
            {c.title}
          </Tag>
        ))}
      </ul>
      {date && <p className="text-white/60">{date}</p>}
    </div>
  );
};

export default CategoryDate;
