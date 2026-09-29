import { cn } from "@/lib/utils";
import PlayIcon from "@assets/icons/play.svg";

type PlayButtonProps = { className?: string; label: string; onClick: () => void };

const PlayButton = ({ className, label, onClick }: PlayButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group absolute inset-0 h-full w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
    >
      <span
        className={cn(
          "glass-border absolute top-1/2 left-1/2 flex h-16 w-16 -translate-1/2 items-center justify-center rounded-full backdrop-blur-xl transition-colors hover:after:bg-[rgba(234,245,255,0.1)] active:after:bg-[rgba(234,245,255,0.2)]",
          className,
        )}
      >
        <PlayIcon className="h-auto w-4.5" />
      </span>
    </button>
  );
};

export default PlayButton;
