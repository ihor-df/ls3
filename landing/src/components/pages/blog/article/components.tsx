import { PortableTextComponents } from "next-sanity";

export const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-5 leading-[1.4] text-[#C3C3C3] md:mt-6 md:text-xl">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-12 mb-5 text-2xl leading-[1.2] font-bold text-white md:mt-16 md:mb-9 md:text-4xl md:tracking-[-0.03em]">
        {children}
      </h2>
    ),
    h3: ({ children }) => <h3 className="text-2xl leading-tight font-bold text-white">{children}</h3>, // fix
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
          className="text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
  },
  list: {
    bullet: ({ children }) => <ul className="my-6 list-disc space-y-2 pl-5 text-white/72">{children}</ul>,
    number: ({ children }) => <ol className="my-6 list-decimal space-y-2 pl-5 text-white/72">{children}</ol>,
  },
};
