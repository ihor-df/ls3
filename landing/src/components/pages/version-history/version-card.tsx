import Tag from "@/components/atoms/tag";
import { cn } from "@/lib/utils";

type VersionCardProps = {
  className?: string;
};

const VersionCard = ({ className }: VersionCardProps) => {
  return (
    <li className={cn("group mt-10 first:mt-0 md:mt-16", className)}>
      <div className="flex flex-col gap-5 md:flex-row md:gap-10">
        <div className="rounded-small bg-accent-orange aspect-350/197 h-auto w-full md:w-71"></div>

        <div className="flex grow items-center">
          <div className="flex items-center md:flex-col md:items-start md:gap-4">
            <span className="text-[2.5rem] leading-none font-bold tracking-[-0.4px] md:tracking-[-1.2px]">v2.13.1</span>
            <Tag className="max-md:ml-4">Minor</Tag>
          </div>
          <span className="ml-auto text-sm text-white/60 md:self-start md:text-base">April 22, 2026</span>
        </div>
      </div>

      <p className="mt-5 leading-[1.4]">
        We recommend downloading a useful update for the program. In this new version, we have fixed bugs discovered
        after the major update, improved application stability, and further optimized session startup and shutdown. We
        also added UDP support for new proxy providers and made minor adjustments to the anti-detect functionality.
      </p>

      <hr className="mt-10 border-white/10 group-last:hidden md:mt-16" />
    </li>
  );
};

export default VersionCard;
