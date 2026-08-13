import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type ContainerProps = ComponentProps<"div"> & {};

const Container = ({ className, children }: ContainerProps) => {
  return (
    <div className={cn("mx-auto flex h-full w-full max-w-[1600px] flex-1 flex-col px-5 md:px-10 xl:px-20", className)}>
      {children}
    </div>
  );
};

export default Container;
