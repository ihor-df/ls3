import Container from "@components/atoms/container";
import Image from "next/image";

export default function Home() {
  return (
    <Container>
      <main className="py-32">
        <Image className="h-5 w-25 dark:invert" src="/next.svg" alt="Next.js logo" width={100} height={20} priority />
      </main>
    </Container>
  );
}
