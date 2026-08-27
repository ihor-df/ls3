import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ComponentProps, ReactNode } from "react";

type GlassButtonProps = {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  linkProps?: ComponentProps<"a">;
  buttonProps?: ComponentProps<"button">;
};

const GlassButton = ({ children, className, buttonProps, linkProps, disabled }: GlassButtonProps) => {
  const styles = cn(
    "glass-border backdrop-blur-xl px-16 py-2 flex items-center justify-center h-17 w-full cursor-pointer rounded-full font-bold text-white transition-colors md:h-18 md:w-auto md:max-w-max md:text-xl",
    "hover:after:bg-[rgba(234,245,255,0.1)] active:after:bg-[rgba(234,245,255,0.2)]",
    "disabled:pointer-events-none disabled:cursor-default disabled:opacity-50",
  );

  if (linkProps && linkProps.href)
    return (
      <Link {...linkProps} href={disabled ? "#" : linkProps.href} className={cn(styles, className)}>
        {children}
      </Link>
    );

  return (
    <button
      type="button"
      {...buttonProps}
      disabled={disabled ?? buttonProps?.disabled}
      className={cn(styles, className)}
    >
      {children}
    </button>
  );
};

export default GlassButton;
