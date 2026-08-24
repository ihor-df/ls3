import { Link } from "@/i18n/navigation";
import Container from "@components/atoms/container";

export default async function Home() {
  return (
    <Container>
      <nav className="flex flex-col">
        <Link href="blog">Blog</Link>
        <Link href="partners">Partners</Link>
      </nav>
    </Container>
  );
}
