import DeFlag from "@assets/icons/flags/de.svg";
import EnFlag from "@assets/icons/flags/en.svg";
import EsFlag from "@assets/icons/flags/es.svg";
import FrFlag from "@assets/icons/flags/fr.svg";
import PtFlag from "@assets/icons/flags/pt.svg";
import RuFlag from "@assets/icons/flags/ru.svg";
import TrFlag from "@assets/icons/flags/tr.svg";
import UkFlag from "@assets/icons/flags/uk.svg";
import ZhFlag from "@assets/icons/flags/zh.svg";

import Blog from "@assets/icons/header/resources/blog.svg";
import Contacts from "@assets/icons/header/resources/contacts.svg";
import Documentation from "@assets/icons/header/resources/documentation.svg";
import FAQ from "@assets/icons/header/resources/faq.svg";
import GuideVideos from "@assets/icons/header/resources/guide-videos.svg";
import Partners from "@assets/icons/header/resources/partners.svg";
import Publications from "@assets/icons/header/resources/publications.svg";
import ReferralProgram from "@assets/icons/header/resources/referral-program.svg";
import VersionHistory from "@assets/icons/header/resources/version-history.svg";
import About from "@assets/icons/logo.svg";

import Fingerprint from "@assets/icons/header/platform/fingerprint.svg";
import Mobile from "@assets/icons/header/platform/mobile.svg";
import WebAutomation from "@assets/icons/header/platform/web-automation.svg";

import AffiliateMarketing from "@assets/icons/header/use-cases/affiliate-marketing.svg";
import Betting from "@assets/icons/header/use-cases/betting.svg";
import Cryptocurrency from "@assets/icons/header/use-cases/cryptocurrency.svg";
import DigitalAgencies from "@assets/icons/header/use-cases/digital-agencies.svg";
import Dropshipping from "@assets/icons/header/use-cases/dropshipping.svg";
import MultiAccount from "@assets/icons/header/use-cases/multi-account.svg";
import TrafficArbitrage from "@assets/icons/header/use-cases/traffic-arbitrage.svg";
import WebScraping from "@assets/icons/header/use-cases/web-scraping.svg";
import { Locale } from "next-intl";

export const RESOURCES: {
  label: string;
  href: string;
  icon: any;
}[] = [
  {
    label: "Documentation",
    icon: Documentation,
    href: "/docs",
  },
  {
    label: "Guide videos",
    icon: GuideVideos,
    href: "/guide-videos",
  },
  {
    label: "Version history",
    icon: VersionHistory,
    href: "/version-history",
  },

  {
    label: "Blog",
    icon: Blog,
    href: "/blog",
  },
  {
    label: "Partners",
    icon: Partners,
    href: "/partners",
  },
  {
    label: "Publications",
    icon: Publications,
    href: "/publications",
  },
  {
    label: "Referral program",
    icon: ReferralProgram,
    href: "/referral-program",
  },
  {
    label: "Contact us",
    icon: Contacts,
    href: "/contact",
  },
  {
    label: "About us",
    icon: About,
    href: "/about",
  },
  {
    label: "FAQ",
    icon: FAQ,
    href: "/faq",
  },
];

export const USE_CASES: {
  label: string;
  href: string;
  icon: any;
}[] = [
  {
    label: "Multi-account",
    icon: MultiAccount,
    href: "/multi-account-management",
  },
  {
    label: "Traffic arbitrage",
    icon: TrafficArbitrage,
    href: "/traffic",
  },
  {
    label: "Cryptocurrency",
    icon: Cryptocurrency,
    href: "/crypto",
  },
  {
    label: "Affiliate marketing",
    icon: AffiliateMarketing,
    href: "/affiliate-marketing",
  },
  {
    label: "Web scraping",
    icon: WebScraping,
    href: "/web-scraping",
  },
  {
    label: "Betting",
    icon: Betting,
    href: "/betting",
  },
  {
    label: "Dropshipping & E-commerce",
    icon: Dropshipping,
    href: "/dropshipping-and-ecommerce",
  },
  {
    label: "Digital agencies",
    icon: DigitalAgencies,
    href: "/digital-agencies",
  },
];

export const SOLUTIONS: {
  label: string;
  href: string;
  icon: any;
}[] = [
  {
    label: "Mobile antidetect Browser",
    icon: Mobile,
    href: "/mobile-antidetect-browser",
  },
  {
    label: "Web automation",
    icon: WebAutomation,
    href: "/web-automation",
  },
  {
    label: "Fingerprint management",
    icon: Fingerprint,
    href: "/fingerprint-management",
  },
  {
    label: "Teamwork",
    icon: MultiAccount,
    href: "/teamwork",
  },
];

export const LOCALES_DATA: {
  code: Locale;
  label: string;
  icon: any;
}[] = [
  {
    code: "en",
    label: "English",
    icon: EnFlag,
  },
  {
    code: "ru",
    label: "Русский",
    icon: RuFlag,
  },
  {
    code: "uk",
    label: "Українська",
    icon: UkFlag,
  },
  {
    code: "pt",
    label: "Português",
    icon: PtFlag,
  },
  {
    code: "es",
    label: "Español",
    icon: EsFlag,
  },
  {
    code: "fr",
    label: "Français",
    icon: FrFlag,
  },
  {
    code: "de",
    label: "Deutsch",
    icon: DeFlag,
  },
  {
    code: "tr",
    label: "Türkçe",
    icon: TrFlag,
  },
  {
    code: "zh",
    label: "简体中文",
    icon: ZhFlag,
  },
];
