"use client";

import { BreadcrumbItemData, Breadcrumbs } from "@/components/molecules/breadcrumbs";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Container from "../atoms/container";

type PageClientLayoutProps = {
  breadcrumbs?: BreadcrumbItemData[];
  className?: string;
  children: ReactNode;
};

const PageClientLayout = ({ className, children, breadcrumbs }: PageClientLayoutProps) => {
  const pathname = usePathname();

  return (
    <Container as="main" className={cn(className)}>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} pathname={pathname} />}
      {children}
    </Container>
  );
};

export default PageClientLayout;
