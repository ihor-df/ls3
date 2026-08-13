import GlassButton from "@/components/atoms/glass-button";
import Button from "@/components/atoms/main-button";
import Container from "@components/atoms/container";
import Image from "next/image";

export default function Page() {
  return (
    <Container>
      <main className="py-32">
        <Image className="h-5 w-25 dark:invert" src="/next.svg" alt="Next.js logo" width={100} height={20} priority />

        <div className="mt-20 flex flex-col gap-10">
          <GlassButton>Button</GlassButton>
          <Button header>Start for free</Button>
          <Button size="large">Button</Button>
          <Button size="large" variant="secondary">
            Button
          </Button>
          <Button>Start for free</Button>
          <Button variant="secondary">Start for free</Button>
        </div>
      </main>
    </Container>
  );
}
