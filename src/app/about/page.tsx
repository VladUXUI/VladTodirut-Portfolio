import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import About from "@/content/about.mdx";
import { pageMetadata } from "@/app/shared-metadata";
import { JsonLd, aboutGraph } from "@/app/structured-data";

export const metadata: Metadata = pageMetadata({
  title: "About — Vlad Todirut",
  description:
    "Senior product designer with 15 years of experience on complex products, from MetaMask's first UX pass to Bitcoin finance. These days I also build what I design.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col">
      <JsonLd graph={aboutGraph()} />
      <Container as="section" className="pt-160 lg:pt-192">
        <article className="mx-auto flex max-w-[1100px] flex-col gap-24">
          <About />
        </article>
      </Container>
    </main>
  );
}
