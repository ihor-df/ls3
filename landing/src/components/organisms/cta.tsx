import { cn } from "@/lib/utils";
import logo from "@public/images/logo-sm@2x.png";
import Image from "next/image";
import LocalVideoPlayer from "../atoms/local-video-player";
import Button from "../atoms/main-button";

type CtaProps = {
  size?: "sm" | "lg";
  discount?: boolean;
  className?: string;
};

const Cta = ({ size = "sm", discount, className }: CtaProps) => {
  const large = size === "lg";

  return (
    <section className={cn("rounded-large bg-[#19191A]", className)}>
      <div className="rounded-large relative overflow-hidden">
        {/* bg */}
        <LocalVideoPlayer
          className="absolute inset-0 h-full w-full object-cover object-center"
          controls={false}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/images/orange-clouds@2x.webp"
          sources={[
            { src: "/videos/orange_clouds_v2/orange_clouds-1200.webm", type: "video/webm" },
            { src: "/videos/orange_clouds_v2/orange_clouds-1200.mp4", type: "video/mp4" },
          ]}
        />

        {/* body */}
        <div
          className={cn(
            "relative z-10 h-full items-center justify-start p-5 leading-[1.2] text-white max-md:text-center md:flex md:gap-6 md:p-10",
            large && "md:flex-col md:gap-0",
          )}
        >
          <Image
            src={logo}
            alt="Linken Sphere logo"
            className={cn("size-18 max-md:mx-auto md:size-20", large && "md:size-37")}
          />

          <strong
            className={cn(
              "text-[1.75rem] font-bold tracking-[-0.02em] max-md:mt-2 md:tracking-[-0.03em]",
              large && "mt-2 text-center leading-none md:text-[3.5rem] md:tracking-[-0.01em]",
            )}
          >
            {large ? "Get started with" : "Work anonymously with"}{" "}
            <span className={cn(!large && "max-md:block")}>Linken Sphere</span>
          </strong>

          {large && (
            <p className="mt-5 tracking-[-0.01] md:mt-6 md:text-base">
              Get everything you need for secure work, with support always available when you need it
            </p>
          )}

          <Button className={cn("w-auto text-nowrap max-md:mx-auto max-md:mt-5", large ? "md:mt-10" : "md:ml-auto")}>
            Start for free
          </Button>
        </div>
      </div>

      {discount && (
        <p className="p-5 max-md:text-center md:p-10">
          <span className="text-white max-md:block">Want to try Linken Sphere at a discount?</span> Use promo code
          “LSBLOG” and get 30% off any subscription. Offer valid for new users only
        </p>
      )}
    </section>
  );
};

export default Cta;
