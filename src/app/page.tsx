import { Hero } from "@/components/hero/Hero";
import { SelectedWorks } from "@/components/works/SelectedWorks";

export default function Home() {
  return (
    <main className="isolate flex flex-1 flex-col">
      <Hero />
      <SelectedWorks />
    </main>
  );
}
