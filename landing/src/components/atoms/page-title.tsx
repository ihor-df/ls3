import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type HeadingProps = ComponentProps<"h1"> & {
  variant: "page-sm";
};

const Heading = ({ className, children, variant }: HeadingProps) => {
  switch (variant) {
    case "page-sm":
      return (
        <h1 className={cn("text-[2.5rem] leading-none font-bold tracking-[-0.01em] md:text-[3.5rem]", className)}>
          {children}
        </h1>
      );

    default:
      return <h1 className={className}>{children}</h1>;
  }
};

export default Heading;
