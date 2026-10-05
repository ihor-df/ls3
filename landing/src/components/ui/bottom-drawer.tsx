"use client";

import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactElement, ReactNode } from "react";
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
  return (
    <Dialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={cn(styles.overlay, "fixed inset-0 z-40 bg-black/70", overlayClassName)} />

        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            styles.content,
            "bg-dark-grey rounded-t-large fixed inset-x-px bottom-0 z-50 mx-auto flex max-h-[65dvh] min-h-[50dvh] w-[100%-2px] flex-col items-center gap-5 overflow-hidden px-5 pt-10 pr-3 pb-5 text-white shadow-[0_-7px_18.6px_0_#000] outline-none md:rounded-t-[5rem] md:px-10 md:pt-12",
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

          <div className={cn("custom-scrollbar min-h-0 w-full flex-1 overflow-y-auto", scrollAreaClassName)}>
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default BottomDrawer;
