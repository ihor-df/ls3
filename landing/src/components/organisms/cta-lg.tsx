import { cn } from "@/lib/utils";

import logo from "@public/images/logo-sm@2x.png";
import news from "@public/images/news@2x.png";
import Image from "next/image";

import { ReactNode } from "react";
import GlassButton from "../atoms/glass-button";
import Button from "../atoms/main-button";
import CloudBackground from "../molecules/cloud-background";

type Variant = "get-started" | "become-partner";

type CloudObj = { title: ReactNode; description: ReactNode };

type CtaProps = {
  className?: string;
  variant: Variant;
};

const CONTENT_MAPPER: Record<Variant, CloudObj> = {
  "get-started": {
    title: (
      <>
        Get started with <span>Linken Sphere</span>
      </>
    ),
    description: "Get everything you need for secure work, with support always available when you need it",
  },
  "become-partner": {
    title: "Become our partner",
    description: "Together, we will create an even more powerful and profitable ecosystem for professionals",
  },
};

const Cta = ({ variant, className }: CtaProps) => {
  const becomePartner = variant === "become-partner";

  return (
    <section className={cn("rounded-large relative overflow-hidden", className)}>
      <CloudBackground playSpeed={becomePartner ? 0.7 : 1} color={becomePartner ? "blue" : "orange"} />

      <div
        className={cn(
          "relative z-10 h-full items-center justify-start p-5 text-center leading-[1.2] text-white md:flex md:flex-col md:gap-0 md:p-10",
        )}
      >
        <Image
          src={becomePartner ? news : logo}
          alt="Linken Sphere logo"
          className={cn("h-auto w-18 max-md:mx-auto md:size-37")}
        />

        <strong
          className={cn(
            "mt-2 text-center text-[1.75rem] leading-none font-bold tracking-[-0.02em] md:text-[3.5rem] md:tracking-[-0.01em]",
          )}
        >
          {CONTENT_MAPPER[variant].title}
        </strong>

        <p className="mt-5 tracking-[-0.01] md:mt-6 md:text-base">{CONTENT_MAPPER[variant].description}</p>

        <div className="mt-auto">
          {becomePartner ? (
            <GlassButton className="mx-auto w-auto max-md:mt-5 md:mt-10">Submit a request</GlassButton>
          ) : (
            <Button className={cn("mx-auto w-auto text-nowrap max-md:mt-5 md:mt-10")}>Start for free</Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Cta;
