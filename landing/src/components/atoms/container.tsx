import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type ContainerProps = ComponentProps<"div"> & {
  as?: React.ElementType;
};

const Container = ({ className, children, as = "div" }: ContainerProps) => {
  const Tag = as;

  return (
    <Tag
      className={cn(
        "mx-auto flex h-full w-full max-w-[1600px] flex-1 flex-col px-5 py-37 md:px-10 md:py-40 xl:px-20",
        className,
      )}
    >
      {children}
    </Tag>
  );
};

export default Container;
