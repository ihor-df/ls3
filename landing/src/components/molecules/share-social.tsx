import { cn } from "@/lib/utils";
import {
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
  VKShareButton,
  WhatsappShareButton,
} from "next-share";
import { ComponentPropsWithoutRef } from "react";

import { copyToClipboard } from "@/lib/helpers/copy-to-clipboard";
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
    <li
      {...props}
      className="hover:bg-accent-light-blue group hover:border-accent-light-blue flex size-13 rounded-full border border-white/50 bg-white/25 transition-colors"
    >
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
  const iconStyles = "fill-accent-dark-blue my-auto mx-auto h-[22px] w-[22px] group-hover:fill-white transition-colors";
  const buttonStyles = {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    borderRadius: "100%",
  };

  const buttonClassName = "hover:bg-accent-light-blue!";

  const handleLinkedInShare = () => {
    void copyToClipboard(linkedInShareText);
    window.open(linkedInShareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <ul className={cn("max-xs:justify-between flex flex-wrap gap-2 xl:gap-2.5 [&>li]:max-h-max", className)}>
      <ListItem>
        <TelegramShareButton
          aria-label="Share on Telegram"
          style={buttonStyles}
          className={buttonClassName}
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
          className={buttonClassName}
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
          className={buttonClassName}
          url={url}
          quote={shareText}
          blankTarget
        >
          <FbIcon aria-hidden="true" focusable="false" className={iconStyles} />
          <span className="sr-only">Share on Facebook</span>
        </FacebookShareButton>
      </ListItem>
      <ListItem>
        <TwitterShareButton
          aria-label="Share on X"
          style={buttonStyles}
          className={buttonClassName}
          url={url}
          title={shareText}
          blankTarget
        >
          <XIcon aria-hidden="true" focusable="false" className={iconStyles} />
          <span className="sr-only">Share on X</span>
        </TwitterShareButton>
      </ListItem>
      <ListItem>
        <VKShareButton
          aria-label="Share on VK"
          style={buttonStyles}
          className={buttonClassName}
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
        <button
          aria-label="Share on LinkedIn"
          type="button"
          style={buttonStyles}
          className={buttonClassName}
          onClick={handleLinkedInShare}
        >
          <InIcon aria-hidden="true" focusable="false" className={iconStyles} />
          <span className="sr-only">Share on LinkedIn</span>
        </button>
      </ListItem>
    </ul>
  );
};
