import BlogSearchProvider from "@/context/blog-search-provider";
import PartnersSearchProvider from "@/context/partners-search-provider";
import { ReactNode } from "react";

type ContextProvidersProps = {
  children: ReactNode;
};

const ContextProviders = ({ children }: ContextProvidersProps) => {
  return (
    <BlogSearchProvider>
      <PartnersSearchProvider>{children}</PartnersSearchProvider>
    </BlogSearchProvider>
  );
};

export default ContextProviders;
