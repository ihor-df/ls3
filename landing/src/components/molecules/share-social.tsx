"use client";

import { cn } from "@/lib/utils";
import {
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
  VKShareButton,
  WhatsappShareButton,
} from "next-share";

import useCheckScreen from "@/hooks/useCheckScreen";
import { copyToClipboard } from "@/lib/helpers/copy-to-clipboard";
import { ComponentPropsWithoutRef, useId, useState } from "react";
import ButtonRounded, { buttonRoundedStyles } from "../atoms/button-rounded";

import Share from "@assets/icons/share.svg";
import FbIcon from "@assets/icons/socials/facebook.svg";
import InIcon from "@assets/icons/socials/linkedin.svg";
import TgIcon from "@assets/icons/socials/telegram.svg";
import XIcon from "@assets/icons/socials/twitter.svg";
import VkIcon from "@assets/icons/socials/vk.svg";
import WaIcon from "@assets/icons/socials/whatsapp.svg";

type ShareSocialProps = {
  url: string;
  title: string;
  description?: string;
  imageUrl?: string;
  className?: string;
};

const ListItem = ({ children, ...props }: ComponentPropsWithoutRef<"li">) => {
  return (
    <li {...props} className={buttonRoundedStyles}>
      {children}
    </li>
  );
};

export const ShareSocial = ({ url, title, description, imageUrl, className }: ShareSocialProps) => {
  const shareTitle = title.trim() || "NOID";
  const shareDescription = description?.trim();
  const shareText = [shareTitle, shareDescription].filter(Boolean).join("\n\n");
  const linkedInShareText = [shareText, url].filter(Boolean).join("\n\n");
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const [isOpen, setIsOpen] = useState(false);

  const menuId = useId();
  const isMobile = useCheckScreen("(max-width: 767px)");
  const isMenuHidden = isMobile === true && !isOpen;

  const iconStyles = "my-auto mx-auto h-5.5 w-5.5";
  const buttonStyles = {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    borderRadius: "100%",
    cursor: "pointer",
  };

  const handleLinkedInShare = () => {
    void copyToClipboard(linkedInShareText);
    window.open(linkedInShareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative size-13 min-h-full md:h-13 md:w-auto">
      <div
        className={cn(
          "glass absolute! top-0 right-0 z-20 h-13 overflow-hidden! rounded-full p-0 backdrop-blur-xl transition-[height,padding]! duration-300",
          "md:relative! md:h-13! md:w-auto md:overflow-visible! md:bg-transparent! md:p-0! md:backdrop-blur-none! md:transition-none md:before:bg-[linear-gradient(to_bottom,transparent,transparent)]! md:after:shadow-none!",
          isOpen ? "h-101 p-2" : "before:bg-[linear-gradient(to_bottom,transparent,transparent)]! after:shadow-none!",
        )}
      >
        <ButtonRounded
          buttonProps={{
            "aria-controls": menuId,
            "aria-expanded": isOpen,
            "aria-label": isOpen ? "Close share menu" : "Open share menu",
            onClick: () => setIsOpen((open) => !open),
          }}
          className="md:hidden"
        >
          <Share aria-hidden="true" focusable="false" className="size-5.5" />
        </ButtonRounded>

        <ul
          id={menuId}
          aria-hidden={isMenuHidden || undefined}
          inert={isMenuHidden}
          className={cn("flex gap-1 max-md:mt-1 max-md:flex-col", className)}
        >
          <ListItem>
            <TelegramShareButton
              aria-label="Share on Telegram"
              style={buttonStyles}
              url={url}
              title={shareText}
              blankTarget
            >
              <TgIcon aria-hidden="true" focusable="false" className={iconStyles} />
              <span className="sr-only">Share on Telegram</span>
            </TelegramShareButton>
          </ListItem>

          <ListItem>
            <WhatsappShareButton
              aria-label="Share on WhatsApp"
              style={buttonStyles}
              url={url}
              title={shareText}
              separator={"\n\n"}
              blankTarget
            >
              <WaIcon aria-hidden="true" focusable="false" className={iconStyles} />
              <span className="sr-only">Share on WhatsApp</span>
            </WhatsappShareButton>
          </ListItem>

          <ListItem>
            <FacebookShareButton
              aria-label="Share on Facebook"
              style={buttonStyles}
              url={url}
              quote={shareText}
              blankTarget
            >
              <FbIcon aria-hidden="true" focusable="false" className={iconStyles} />
              <span className="sr-only">Share on Facebook</span>
            </FacebookShareButton>
          </ListItem>

          <ListItem>
            <TwitterShareButton aria-label="Share on X" style={buttonStyles} url={url} title={shareText} blankTarget>
              <XIcon aria-hidden="true" focusable="false" className={iconStyles} />
              <span className="sr-only">Share on X</span>
            </TwitterShareButton>
          </ListItem>

          <ListItem>
            <VKShareButton
              aria-label="Share on VK"
              style={buttonStyles}
              url={url}
              title={shareTitle}
              image={imageUrl}
              blankTarget
            >
              <VkIcon aria-hidden="true" focusable="false" className={iconStyles} />
              <span className="sr-only">Share on VK</span>
            </VKShareButton>
          </ListItem>

          <ListItem>
            <button aria-label="Share on LinkedIn" type="button" style={buttonStyles} onClick={handleLinkedInShare}>
              <InIcon aria-hidden="true" focusable="false" className={iconStyles} />
              <span className="sr-only">Share on LinkedIn</span>
            </button>
          </ListItem>
        </ul>
      </div>
    </div>
  );
};
