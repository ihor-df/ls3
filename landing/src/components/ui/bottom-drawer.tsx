"use client";

import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useRef, useState, type ReactElement, type ReactNode, type TouchEvent } from "react";
import styles from "./bottom-drawer.module.css";

type BottomDrawerProps = {
  trigger: ReactElement;
  title: ReactNode;
  closeLabel: string;
  children?: ReactNode;
  className?: string;
  overlayClassName?: string;
  scrollAreaClassName?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const BottomDrawer = ({
  trigger,
  title,
  closeLabel,
  children,
  className,
  overlayClassName,
  scrollAreaClassName,
  open,
  defaultOpen,
  onOpenChange,
}: BottomDrawerProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const swipeStartRef = useRef<{ identifier: number; x: number; y: number } | null>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    swipeStartRef.current = null;
    setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    swipeStartRef.current = null;

    if (event.touches.length !== 1) return;

    const scrollArea = scrollAreaRef.current;

    // A gesture within a scrolled list should only scroll it back toward the top.
    if (scrollArea?.contains(event.target as Node) && scrollArea.scrollTop > 0) return;

    const touch = event.touches[0];
    swipeStartRef.current = { identifier: touch.identifier, x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    if (!start) return;

    if (event.touches.length !== 1) {
      swipeStartRef.current = null;
      return;
    }

    const touch = event.touches[0];
    const deltaX = Math.abs(touch.clientX - start.x);
    const deltaY = touch.clientY - start.y;

    // Ignore small movements; upward and horizontal gestures belong to the content.
    if (Math.max(deltaX, Math.abs(deltaY)) > 10 && (deltaY <= 0 || deltaX >= deltaY)) {
      swipeStartRef.current = null;
    }
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (!start) return;

    const touch = Array.from(event.changedTouches).find((touch) => touch.identifier === start.identifier);
    if (!touch) return;

    const deltaX = Math.abs(touch.clientX - start.x);
    const deltaY = touch.clientY - start.y;

    if (deltaY >= 64 && deltaY > deltaX) {
      handleOpenChange(false);
    }
  };

  return (
    <Dialog.Root open={open ?? internalOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={cn(styles.overlay, "fixed inset-0 z-40 bg-black/70", overlayClassName)} />

        <Dialog.Content
          aria-describedby={undefined}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={() => {
            swipeStartRef.current = null;
          }}
          className={cn(
            styles.content,
            "bg-dark-grey rounded-t-large fixed inset-x-px bottom-0 z-50 mx-auto flex max-h-[65dvh] min-h-[50dvh] w-[100%-2px] flex-col items-center gap-5 overflow-hidden px-5 pt-10 pb-5 text-white shadow-[0_-7px_18.6px_0_#000] outline-none md:rounded-t-[5rem] md:px-10 md:pt-12",
            className,
          )}
        >
          <div
            aria-hidden="true"
            className="absolute top-5 left-1/2 h-1 w-20 -translate-x-1/2 rounded-full bg-white md:h-2"
          />

          <div className="flex w-full items-center gap-4">
            <Dialog.Title className="text-2xl leading-none font-bold tracking-[-0.02em] md:text-4xl">
              {title}
            </Dialog.Title>

            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={closeLabel}
                className="ml-auto flex shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
              >
                <X aria-hidden="true" className="size-7 md:size-9" />
              </button>
            </Dialog.Close>
          </div>

          <div
            ref={scrollAreaRef}
            className={cn(
              "custom-scrollbar min-h-0 w-full flex-1 overflow-y-auto overscroll-y-contain",
              scrollAreaClassName,
            )}
          >
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default BottomDrawer;
