import creatingSessionCover from "@public/images/guide-video-covers/creating-a-session.webp";
import fastProxyEditingCover from "@public/images/guide-video-covers/fast-proxy-editing.webp";
import importBookmarksCover from "@public/images/guide-video-covers/import-bookmarks.webp";
import installExtensionsCover from "@public/images/guide-video-covers/install-extensions.webp";
import manageProxyListCover from "@public/images/guide-video-covers/manage-proxy-list.webp";
import massActionsCover from "@public/images/guide-video-covers/mass-actions.webp";
import massSessionCreationCover from "@public/images/guide-video-covers/mass-careation-of-sessions.webp";
import proxyManagerCover from "@public/images/guide-video-covers/proxy-manager.webp";
import sessionManagerCover from "@public/images/guide-video-covers/session-manager.webp";
import teamManagementCover from "@public/images/guide-video-covers/team-management.webp";
import warmingUpSessionsCover from "@public/images/guide-video-covers/warming-up-for-sessions.webp";
import windowControlModesCover from "@public/images/guide-video-covers/window-control-modes.webp";
import workingWithPresetsCover from "@public/images/guide-video-covers/working-with-presets.webp";
import mobileTabletSessionsCover from "@public/images/guide-video-covers/working-wth-mobile-and-tablet-sessions.webp";

export const GUIDE_VIDEO_CATEGORY_SLUGS = ["sessions", "preset", "proxies", "teamwork"] as const;

export type GuideVideoCategorySlug = (typeof GUIDE_VIDEO_CATEGORY_SLUGS)[number];

export const GUIDE_VIDEOS = [
  {
    id: "creatingSession",
    category: "sessions",
    videoId: "-9KQrf8xuVk",
    ruVideoId: "ygwpjz6D3Rw",
    cover: creatingSessionCover,
  },
  {
    id: "workingWithPresets",
    category: "preset",
    videoId: "DCfdHOY5XMw",
    ruVideoId: "8xqHnbxb8wA",
    cover: workingWithPresetsCover,
  },
  {
    id: "warmingUpSessions",
    category: "sessions",
    videoId: "QtAtmj2_8hQ",
    ruVideoId: "tJrnuP3RlW8",
    cover: warmingUpSessionsCover,
  },
  {
    id: "mobileTabletSessions",
    category: "sessions",
    videoId: "xfKL8T2UQU4",
    ruVideoId: "3potGxkaNSg",
    cover: mobileTabletSessionsCover,
  },
  { id: "sessionManager", category: "sessions", videoId: "1cf4D_oH5DI", cover: sessionManagerCover },
  {
    id: "proxyManager",
    category: "proxies",
    videoId: "46boXsq2BE0",
    ruVideoId: "GbPwkc7QqGA",
    cover: proxyManagerCover,
  },
  { id: "manageProxyList", category: "proxies", videoId: "OP6UvdDzUWs", cover: manageProxyListCover },
  { id: "fastProxyEditing", category: "proxies", videoId: "DoSyJZU9u8U", cover: fastProxyEditingCover },
  {
    id: "massActions",
    category: "sessions",
    videoId: "bXHyYTW-ntE",
    ruVideoId: "1WJVRQXxmRg",
    cover: massActionsCover,
  },
  { id: "massSessionCreation", category: "sessions", videoId: "0QyEaBXxbZM", cover: massSessionCreationCover },
  { id: "installExtensions", category: "sessions", videoId: "4KDQ32_g-bE", cover: installExtensionsCover },
  { id: "importBookmarks", category: "sessions", videoId: "7zuMCWYh9do", cover: importBookmarksCover },
  {
    id: "teamManagement",
    category: "teamwork",
    videoId: "-F4BSLD49ts",
    ruVideoId: "p-nK8xUmvgU",
    cover: teamManagementCover,
  },
  {
    id: "windowControlModes",
    category: "sessions",
    videoId: "0xH5NoxdUAE",
    ruVideoId: "8Vpp6BJmLvE",
    cover: windowControlModesCover,
  },
] as const;

export const isGuideVideoCategorySlug = (slug: string): slug is GuideVideoCategorySlug =>
  GUIDE_VIDEO_CATEGORY_SLUGS.some((category) => category === slug);
