import { BreadcrumbItemData, Breadcrumbs } from "@/components/molecules/breadcrumbs";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Container from "../atoms/container";

type PageClientLayoutProps = {
  breadcrumbs?: BreadcrumbItemData[];
  className?: string;
  children: ReactNode;
};

const PageClientLayout = ({ className, children, breadcrumbs }: PageClientLayoutProps) => {
  return (
    <Container as="main" className={cn(className)}>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      {children}
    </Container>
  );
};

export default PageClientLayout;
