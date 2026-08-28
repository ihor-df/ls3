"use client";

import { Link } from "@/i18n/navigation";
import Logo from "@assets/icons/logo.svg";
import { useLocale } from "next-intl";
import { useState } from "react";
import ButtonRounded from "../../atoms/button-rounded";
import Button from "../../atoms/main-button";

type HeaderProps = {};

const Header = ({}: HeaderProps) => {
  const [activeMenu, setActiveMenu] = useState<"platform" | "use-cases" | "resources" | "language">();
  const locale = useLocale();

  return (
    <header>
      <nav aria-label="main navigation">
        <div className="header-top">
          <Link href="/" aria-label="Linken Sphere — homepage">
            <Logo aria-hidden="true" />
          </Link>

          <ul>
            <li>
              <button aria-expanded={activeMenu === "platform"} aria-controls="platform-submenu" type="button">
                Platform
              </button>
            </li>

            <li>
              <button type="button" aria-expanded={activeMenu === "use-cases"} aria-controls="use-cases-submenu">
                Use cases
              </button>
            </li>

            <li>
              <Link href="/pricing">Pricing</Link>
            </li>

            <li>
              <button type="button" aria-expanded={activeMenu === "resources"} aria-controls="resources-submenu">
                Resources
              </button>
            </li>
          </ul>

          <ButtonRounded
            className="uppercase"
            buttonProps={{
              "aria-expanded": activeMenu === "language",
              "aria-label": `Change language, current language ${locale}`,
              "aria-controls": "language-submenu",
            }}
          >
            {locale}
          </ButtonRounded>

          <Button header>Start for free</Button>
        </div>

        <div className="header-bottom">
          <ul id="platform-submenu" hidden={activeMenu !== "platform"}>
            <li>
              <Link href="/docs">
                <span>Mobile antidetect Browser</span>
              </Link>
            </li>

            <li>
              <Link href="/blog">
                <span>Web automation</span>
              </Link>
            </li>

            <li>
              <Link href="/blog">
                <span>Fingerprint management</span>
              </Link>
            </li>

            <li>
              <Link href="/blog">
                <span>Teamwork</span>
              </Link>
            </li>
          </ul>

          <ul id="use-cases-submenu" hidden={activeMenu !== "use-cases"}>
            <li>
              <Link href="/docs">
                <span>Multi-account </span>
              </Link>
            </li>

            <li>
              <Link href="/blog">
                <span>Traffic arbitrage</span>
              </Link>
            </li>

            <li>
              <Link href="/blog">
                <span>Cryptocurrency</span>
              </Link>
            </li>

            <li>
              <Link href="/blog">
                <span>Affiliate marketing</span>
              </Link>
            </li>

            <li>
              <Link href="/blog">
                <span>Web scraping</span>
              </Link>
            </li>

            <li>
              <Link href="/blog">
                <span>Betting</span>
              </Link>
            </li>

            <li>
              <Link href="/blog">
                <span>Dropshipping E-commerce</span>
              </Link>
            </li>

            <li>
              <Link href="/blog">
                <span>Digital agencies</span>
              </Link>
            </li>
          </ul>

          <ul id="resources-submenu" hidden={activeMenu !== "resources"}>
            <li>
              <Link href="/docs">
                <span>Documentation</span>
              </Link>
            </li>

            <li>
              <Link href="/blog">
                <span>Guide videos</span>
              </Link>
            </li>

            <li>
              <Link href="/blog">
                <span>Version history</span>
              </Link>
            </li>

            <li>
              <Link href="/blog">
                <span>FAQ</span>
              </Link>
            </li>

            <li>
              <Link href="/blog">
                <span>Blog</span>
              </Link>
            </li>

            <li>
              <Link href="/blog">
                <span>Partners</span>
              </Link>
            </li>

            <li>
              <Link href="/blog">
                <span>Publications</span>
              </Link>
            </li>

            <li>
              <Link href="/blog">
                <span>Referral program</span>
              </Link>
            </li>

            <li>
              <Link href="/blog">
                <span>Contact us</span>
              </Link>
            </li>

            <li>
              <Link href="/partners">
                <span>About us</span>
              </Link>
            </li>
          </ul>

          <ul id="language-submenu" hidden={activeMenu !== "platform"}>
            <li>
              <Link href="/blog">
                <span>Mobile antidetect Browser</span>
              </Link>
            </li>

            <li>
              <Link href="/blog">
                <span>Web automation</span>
              </Link>
            </li>

            <li>
              <Link href="/blog">
                <span>Fingerprint management</span>
              </Link>
            </li>

            <li>
              <Link href="/blog">
                <span>Teamwork</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
