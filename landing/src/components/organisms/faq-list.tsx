"use client";

import { usePathname } from "@/i18n/navigation";
import ArrowIcon from "@assets/icons/arrow.svg";
import JsonLd from "@components/system/json-ld";
import { cn } from "@lib/utils";
import { useTranslations } from "next-intl";
import { ComponentProps, useState } from "react";
import { FAQPage } from "schema-dts";
import Heading from "../atoms/heading";

type FAQListProps = ComponentProps<"div"> & {
  data: FAQItem[];
  schemaData?: FAQItem[];
  renderJsonLd?: boolean;
  defaultOpenItem?: number | null;
};

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export default function FAQList({
  className,
  data,
  schemaData = data,
  renderJsonLd = true,
  defaultOpenItem = 0,
  ...props
}: FAQListProps) {
  const [openItem, setOpenItem] = useState<number | null>(defaultOpenItem);

  const t = useTranslations("faq");
  const pathname = usePathname();

  const faqScript: FAQPage = {
    "@type": "FAQPage",
    mainEntity: schemaData.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };

  const isFAQPage = pathname.startsWith("/faq");

  return (
    <>
      {renderJsonLd && <JsonLd data={faqScript} />}

      <div id="faq-section" className={cn(className)} {...props}>
        {!isFAQPage && (
          <Heading as="h2" variant="section" className="mb-10 text-center md:mb-16">
            {t("title")}
          </Heading>
        )}

        <ul className="flex w-full flex-col gap-3 md:gap-5">
          {data.map(({ id, question, answer }, idx) => {
            const isOpen = idx === openItem;

            return (
              <li key={id} value={id.toString()}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  className={cn(
                    "rounded-small grid w-full bg-[#19191A] p-5 text-left transition-colors md:px-7 md:py-8",
                    !isOpen && "cursor-pointer hover:bg-[#252526]",
                  )}
                  onClick={() => setOpenItem(idx)}
                >
                  <span className="flex items-center justify-between text-xl text-white md:text-2xl">
                    <span>{question}</span>
                    <ArrowIcon className="size-6" />
                  </span>

                  <span
                    className={cn(
                      "grid overflow-hidden transition-[grid-template-rows,opacity,padding] duration-300",
                      isOpen ? "grid-rows-[1fr] pt-5 opacity-100 md:pt-6" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <span
                      className={cn(
                        "min-h-0 border-t border-transparent transition-[padding,colors] duration-300",
                        isOpen && "border-white/10 pt-5 md:pt-6",
                      )}
                    >
                      {answer}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
