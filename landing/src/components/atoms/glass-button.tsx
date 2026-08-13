import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";

type GlassButtonProps = ComponentPropsWithoutRef<"button">;

const GlassButton = ({ children, className, ...props }: GlassButtonProps) => {
  return (
    <button
      type="submit"
      className={cn(
        "shadow-tiny-border flex h-17 w-full cursor-pointer items-center justify-center rounded-full border border-transparent px-16 font-bold text-white transition-colors md:h-18 md:w-auto md:max-w-max md:text-xl",
        "after:border after:border-[rgba(234,245,255,0.06)] hover:after:bg-[rgba(234,245,255,0.1)] active:after:bg-[rgba(234,245,255,0.2)]",
        "disabled:pointer-events-none disabled:cursor-default disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default GlassButton;
