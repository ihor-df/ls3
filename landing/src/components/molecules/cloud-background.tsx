import { cn } from "@/lib/utils";
import LocalVideoPlayer from "../atoms/local-video-player";

type Color = "orange" | "blue";
type CloudObj = { poster: string; webM: string; mp4: string };

type CloudBackgroundProps = {
  color: Color;
  playSpeed?: number;
  className?: string;
};

const CloudBackground = ({ color, playSpeed, className }: CloudBackgroundProps) => {
  const orangePoster = "/images/orange-clouds@2x.webp";
  const orangeWebM = "/videos/orange_clouds_v2/orange_clouds-1200.webm";
  const orangeMp4 = "/videos/orange_clouds_v2/orange_clouds-1200.mp4";

  const bluePoster = "/images/blue-clouds@2x.webp";
  const blueWebM = "/videos/blue_clouds_1440/blue_clouds_1440.webm";
  const blueMp4 = "/videos/blue_clouds_1440/blue_clouds_1440.mp4";

  const CLOUDS_MAPPER: Record<Color, CloudObj> = {
    orange: { poster: orangePoster, webM: orangeWebM, mp4: orangeMp4 },
    blue: { poster: bluePoster, webM: blueWebM, mp4: blueMp4 },
  };

  return (
    <LocalVideoPlayer
      className={cn("absolute inset-0 h-full w-full object-cover object-center", className)}
      playbackRate={playSpeed}
      controls={false}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      poster={CLOUDS_MAPPER[color].poster}
      sources={[
        { src: CLOUDS_MAPPER[color].webM, type: "video/webm" },
        { src: CLOUDS_MAPPER[color].mp4, type: "video/mp4" },
      ]}
    />
  );
};

export default CloudBackground;
