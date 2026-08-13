import GlassButton from "@/components/atoms/glass-button";
import GlassInput from "@/components/atoms/glass-input";
import Button from "@/components/atoms/main-button";
import SearchInput from "@/components/atoms/search-input";
import Container from "@components/atoms/container";
import Image from "next/image";

export default function Page() {
  return (
    <Container>
      <main className="py-32">
        <Image className="h-5 w-25 dark:invert" src="/next.svg" alt="Next.js logo" width={100} height={20} priority />

        <div className="mt-20 flex flex-col gap-10">
          <SearchInput />
          <GlassInput placeholder="Your email" />
          <GlassButton>Button</GlassButton>
          <Button header>Start for free</Button>
          <Button size="large">Button</Button>
          <Button size="large" variant="secondary">
            Button
          </Button>
          <Button>Start for free</Button>
          <Button variant="secondary">Start for free</Button>

          <p className="text-2xl">Disabled</p>

          <GlassButton disabled>Button</GlassButton>
          <Button disabled header>
            Start for free
          </Button>
          <Button disabled size="large">
            Button
          </Button>
          <Button disabled size="large" variant="secondary">
            Button
          </Button>
          <Button disabled>Start for free</Button>
          <Button disabled variant="secondary">
            Start for free
          </Button>
        </div>
      </main>
    </Container>
  );
}
