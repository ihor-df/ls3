import Tag from "@/components/atoms/tag";
import { portableTextComponents } from "@/components/molecules/portable-text/components";
import { PortableText } from "next-sanity";
import { Image } from "next-sanity/image";
import type { VersionHistoryItem } from "./types";

const VersionCard = ({ item }: { item: VersionHistoryItem }) => {
  const { body, imageUrl, version, imageAlt, releaseType, formattedReleaseDate } = item;

  return (
    <li className="group mt-10 first:mt-0 md:mt-16">
      <div className="flex flex-col gap-5 md:flex-row md:gap-10">
        <Image
          width={700}
          height={394}
          alt={imageAlt ?? `Linken Sphere ${version}`}
          src={imageUrl ?? ""}
          className="rounded-small aspect-350/200 h-auto w-full object-cover md:w-71"
        />

        <div className="flex grow items-center">
          <div className="flex items-center md:flex-col md:items-start md:gap-4">
            <span className="text-[2.5rem] leading-none font-bold tracking-[-0.4px] md:tracking-[-1.2px]">
              {version}
            </span>
            <Tag className="capitalize max-md:ml-4">{releaseType}</Tag>
          </div>
          <span className="ml-auto text-sm text-white/60 md:self-start md:text-base">{formattedReleaseDate}</span>
        </div>
      </div>

      <div className="text-light-grey mt-5 leading-[1.4]">
        {Array.isArray(body) && <PortableText value={body} components={portableTextComponents} />}
      </div>

      <hr className="mt-10 border-white/10 group-last:hidden md:mt-16" />
    </li>
  );
};

export default VersionCard;
