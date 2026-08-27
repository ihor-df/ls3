import { cn } from "@/lib/utils";

import logo from "@public/images/logo-sm@2x.png";
import Image from "next/image";
import Button from "../atoms/main-button";
import CloudBackground from "../molecules/cloud-background";

type CtaProps = {
  hasDiscount?: boolean;
  className?: string;
};

const Cta = ({ hasDiscount, className }: CtaProps) => {
  return (
    <section className={cn("rounded-large bg-[#19191A]", className)}>
      <div className="rounded-large relative overflow-hidden">
        <CloudBackground color="orange" />

        <div
          className={cn(
            "relative z-10 h-full items-center justify-start p-5 leading-[1.2] text-white max-md:text-center md:flex md:gap-6 md:p-10",
          )}
        >
          <Image src={logo} alt="Linken Sphere logo" className={cn("size-18 max-md:mx-auto md:size-20")} />

          <strong className={cn("text-[1.75rem] font-bold tracking-[-0.02em] max-md:mt-2 md:tracking-[-0.03em]")}>
            Work anonymously with <span className="max-md:block">Linken Sphere</span>
          </strong>

          <Button className={cn("w-auto text-nowrap max-md:mx-auto max-md:mt-5 md:ml-auto")}>Start for free</Button>
        </div>
      </div>

      {hasDiscount && (
        <p className="p-5 max-md:text-center md:p-10">
          <span className="text-white max-md:block">Want to try Linken Sphere at a discount?</span> Use promo code
          “LSBLOG” and get 30% off any subscription. Offer valid for new users only
        </p>
      )}
    </section>
  );
};

export default Cta;
