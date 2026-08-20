"use client";

import ArrowIcon from "@assets/icons/arrow.svg";
import JsonLd from "@components/system/json-ld";
import { cn } from "@lib/utils";
import { ComponentProps, useState } from "react";
import { FAQPage } from "schema-dts";

type FAQProps = ComponentProps<"section"> & {
  data: {
    id: string;
    question: string;
    answer: string;
  }[];
};

export default function FAQ({ className, data, ...props }: FAQProps) {
  const [openItem, setOpenItem] = useState(0);

  // const t = useTranslations("pages.home.faq");

  const faqScript: FAQPage = {
    "@type": "FAQPage",
    mainEntity: data?.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };

  return (
    <>
      <JsonLd data={faqScript} />

      <section id="faq-section" className={cn("py-8", className)} {...props}>
        <h2 className="mb-4 text-center">
          {/* {t("title")} */}
          Popular Questions
        </h2>

        <ul className="flex w-full flex-col">
          {data.map(({ id, question, answer }, idx) => {
            const isOpen = idx === openItem;

            return (
              <li key={id} value={id.toString()} className="grid">
                <button className="flex w-full py-4 text-left" onClick={() => setOpenItem(idx)}>
                  <h3 className="flex w-full justify-between">
                    <span>{question}</span>
                    <ArrowIcon className="size-9" />
                  </h3>
                </button>

                <div
                  className={cn(
                    "grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="min-h-0">{answer}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
