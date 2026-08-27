"use client";

import { ComponentProps, useEffect, useMemo, useRef } from "react";

// How to use:
// <LocalVideoPlayer
//   className="h-full w-full"
//   title="WHAT IS NOID"
//   autoPlay
//   controls
//   playsInline
//   preload="metadata"
//   sources={[{ src: videoSrc, type: "video/mp4" }]}
// />

export type LocalVideoSource = {
  src: string;
  type?: "video/mp4" | "video/webm" | "video/ogg" | string;
};

type LocalVideoPlayerProps = ComponentProps<"video"> & {
  title?: string;
  sources: LocalVideoSource[];
  poster?: string;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  preload?: "none" | "metadata" | "auto";
  playbackRate?: number;
};

export default function LocalVideoPlayer({
  title,
  sources,
  poster,
  autoPlay = false,
  controls = true,
  loop = false,
  muted = false,
  playsInline = true,
  preload = "none",
  playbackRate = 1,
  ...props
}: LocalVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const normalizedSources = useMemo(() => sources.filter((item) => !!item.src?.trim()), [sources]);

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.defaultPlaybackRate = playbackRate;
    videoRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  if (!normalizedSources.length) return null;

  return (
    <video
      key={normalizedSources.map((item) => item.src).join("|")}
      title={title}
      poster={poster}
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      preload={preload}
      {...props}
      ref={videoRef}
    >
      {normalizedSources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
}
