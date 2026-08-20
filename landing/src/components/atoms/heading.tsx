import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type HeadingProps = ComponentProps<"h1"> & {
  variant: "page" | "article" | "section";
  as?: "h1" | "h2" | "h3";
};

const Heading = ({ className, children, variant, as = "h1" }: HeadingProps) => {
  const Tag = as;
  const styles = "text-white font-bold leading-none";

  switch (variant) {
    case "page":
      // 40px/56px
      return (
        <Tag className={cn(styles, "text-[2.5rem] tracking-[-0.01em] md:text-[3.5rem]", className)}>{children}</Tag>
      );
    case "article":
      // 28px/40px
      return (
        <Tag
          className={cn(styles, "text-[1.75rem] tracking-[-0.02em] md:text-[2.5rem] md:tracking-[-0.03em]", className)}
        >
          {children}
        </Tag>
      );
    case "section":
      // 36px/56px/72px
      return (
        <Tag className={cn(styles, "text-4xl tracking-[-0.02em] md:text-[3.5rem] md:tracking-[-0.01em]", className)}>
          {children}
        </Tag>
      );

    default:
      return <Tag className={className}>{children}</Tag>;
  }
};

export default Heading;
