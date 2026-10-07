import type { ReactNode } from "react";

export const dynamic = "force-static";
export const dynamicParams = true;
// Next.js requires a literal; keep this in sync with SANITY_REVALIDATE_TIME.
export const revalidate = 300;

export default function PartnersLayout({ children }: { children: ReactNode }) {
  return children;
}
