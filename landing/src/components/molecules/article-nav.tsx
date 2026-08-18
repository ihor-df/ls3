import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type ArticleNavProps = {
  content: { title: string; href: string }[];
  className?: string;
};

const ArticleNav = ({ content, className }: ArticleNavProps) => {
  const t = useTranslations();

  return (
    <nav className={cn("my-12 md:my-16", className)}>
      <h2 className="text-2xl leading-none font-bold md:text-4xl xl:text-[2rem]">{t("common.articleNav.title")}</h2>

      <ul className="mt-5 list-disc pl-5 leading-[1.4] text-[#C3C3C3] md:mt-9 md:text-xl">
        {content.map(({ title, href }) => {
          if (!title) return;

          return (
            <li key={title} className="transition-colors hover:text-white">
              <a href={href}>{title}</a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default ArticleNav;
