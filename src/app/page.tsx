import { Hero } from "@/components/hero/Hero";
import { ProjectShowcase } from "@/components/works/ProjectShowcase";
import { aiProjects, productProjects } from "@/content/projects";

export default function Home() {
  return (
    <main className="isolate flex flex-1 flex-col">
      <Hero />
      <ProjectShowcase id="work" title="Selected Product Design Works" projects={productProjects} />
      <ProjectShowcase
        id="ai-work"
        title="AI & Design System Works"
        projects={aiProjects}
        accent="green"
        imageSide="right"
      />
    </main>
  );
}
