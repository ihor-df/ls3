import { cn } from "@/lib/utils";
import Image from "next/image";

type AvatarCardProps = { src: string; alt: string; name: string; role: string; className?: string };

const AvatarCard = ({ src, alt, name, role, className }: AvatarCardProps) => {
  return (
    <div className={cn("flex items-center", className)}>
      <Image width={48} height={48} src={src} alt={alt ?? "Avatar image"} className="rounded-full" />

      <div className="ml-4">
        <p className="leading-none tracking-[-0.01em]">{name}</p>
        <p className="mt-2.5 text-sm leading-none tracking-[-0.01em] text-white/60 lg:text-lg">{role}</p>
      </div>
    </div>
  );
};

export default AvatarCard;
