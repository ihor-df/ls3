import { PortableTextComponents } from "next-sanity";
import { ArticleBodyImage } from "./article-body-image";
import { ArticleTable } from "./table";

export const getHeadingId = (key: string) => `section-${key}`;

export const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-5 md:mt-6">{children}</p>,
    h2: ({ children, value }) => (
      <h2
        id={getHeadingId(value._key ?? "")}
        className="mt-12 mb-5 scroll-mt-20 text-2xl leading-[1.2] font-bold text-white md:mt-16 md:mb-9 md:scroll-mt-24 md:text-4xl md:tracking-[-0.03em]"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl leading-[1.2] font-bold text-white md:text-[1.75rem] md:tracking-[-0.03em]">{children}</h3>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "#";
      const isExternal = href.startsWith("http");

      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noreferrer noopener" : undefined}
          className="text-white underline decoration-white underline-offset-4 transition hover:decoration-white"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
    highlight: ({ children }) => (
      <span className="rounded-small my-5 block bg-[#19191A] p-5 md:my-6 md:p-7">
        <mark className="bg-transparent text-[#C3C3C3]">{children}</mark>
      </span>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="my-5 ml-2 list-disc space-y-2 pl-5 md:my-6">{children}</ul>,
    numyer: ({ children }) => <ol className="my-5 ml-2 list-decimal space-y-2 pl-5 md:my-6">{children}</ol>,
  },
  types: {
    articleBodyImage: ArticleBodyImage,
    table: ArticleTable,
  },
};
