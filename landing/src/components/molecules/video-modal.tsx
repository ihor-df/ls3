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
      className="rounded-small bg-dark-grey m-auto max-h-[90dvh] w-[min(92vw,960px)] max-w-none overflow-auto border border-white/15 p-4 text-white backdrop:bg-black/80 md:p-6"
    >
      {video && (
        <>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 id={titleId} className="text-lg font-semibold md:text-xl">
              {video.title}
            </h2>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label={closeLabel}
              className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <iframe
            key={video.videoId}
            className="aspect-video w-full rounded-sm border-0"
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
