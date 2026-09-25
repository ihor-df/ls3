import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import PlayIcon from "@assets/icons/play.svg";
import GlassButton from "./glass-button";

type PlayButtonProps = { className?: string; href: string };

const PlayButton = ({ className, href }: PlayButtonProps) => {
  return (
    <Link target="blanc" href={href} className="group absolute inset-0 h-full w-full">
      <GlassButton
        className={cn(
          "absolute top-1/2 left-1/2 h-16 w-16 -translate-1/2 p-0 md:h-16 md:w-16 md:max-w-none",
          className,
        )}
        buttonProps={{ "aria-label": "Play button" }}
      >
        <PlayIcon className="h-auto w-4.5" />
      </GlassButton>
    </Link>
  );
};

export default PlayButton;
