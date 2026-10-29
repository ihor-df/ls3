"use client";

import useScrollLock from "@/hooks/useScrollLock";
import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";

type Video = {
  videoId: string;
  title: string;
};

type VideoModalProps = {
  video: Video | null;
  closeLabel: string;
  onClose: () => void;
};

const VideoModal = ({ video, closeLabel, onClose }: VideoModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useScrollLock(video !== null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (video && !dialog.open) dialog.showModal();
    if (!video && dialog.open) dialog.close();
  }, [video]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
      className="bg-dark-grey/30 custom-scrollbar m-auto max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-240 overflow-auto overscroll-contain rounded-3xl border border-white/20 p-5 text-white backdrop-blur-3xl backdrop:bg-black/60 md:max-h-[calc(100dvh-3rem)] md:w-[calc(100%-5rem)] lg:p-6"
    >
      {video && (
        <>
          <div className="mb-5 flex items-center justify-between gap-5 lg:mb-7">
            <h2 id={titleId} className="text-2xl leading-none md:text-3xl">
              {video.title}
            </h2>

            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label={closeLabel}
              className="flex shrink-0 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-white"
            >
              <X className="size-7 md:size-9" aria-hidden="true" />
            </button>
          </div>

          <iframe
            key={video.videoId}
            className="aspect-video w-full rounded-2xl border-0 bg-black"
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </>
      )}
    </dialog>
  );
};

export default VideoModal;
