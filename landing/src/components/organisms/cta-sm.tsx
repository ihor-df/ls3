import { cn } from "@/lib/utils";
import logo from "@public/images/logo-sm@2x.png";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Button from "../atoms/main-button";
import CloudBackground from "../molecules/cloud-background";

type CtaProps = {
  hasDiscount?: boolean;
  className?: string;
};

const Cta = ({ hasDiscount, className }: CtaProps) => {
  const t = useTranslations("common.cta.workAnon");

  return (
    <section className={cn("rounded-large bg-[#19191A]", className)}>
      <div className="rounded-large relative overflow-hidden">
        <CloudBackground color="orange" />

        <div
          className={cn(
            "relative z-10 h-full items-center justify-start p-5 leading-[1.2] text-white max-md:text-center md:flex md:gap-5 md:p-10",
          )}
        >
          <Image src={logo} alt="Linken Sphere logo" className={cn("size-18 max-md:mx-auto md:size-20")} />

          <strong className={cn("text-[1.75rem] font-bold tracking-[-0.02em] max-md:mt-2 md:tracking-[-0.03em]")}>
            {t("main")}
          </strong>

          <Button className={cn("w-auto text-nowrap max-md:mx-auto max-md:mt-5 md:ml-auto")}>{t("button")}</Button>
        </div>
      </div>

      {hasDiscount && (
        <p className="p-5 max-md:text-center md:p-10">
          <span className="text-white max-md:block">{t("discount.1")}</span> {t("discount.2")}
        </p>
      )}
    </section>
  );
};

export default Cta;
