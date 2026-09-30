import { Hero } from "@/components/hero/Hero";
import { SkillSets } from "@/components/skills/SkillSets";
import { HorizontalShowcase } from "@/components/works/HorizontalShowcase";
import { ProjectShowcase } from "@/components/works/ProjectShowcase";
import { aiProjects, productProjects } from "@/content/projects";

export default function Home() {
  return (
    <main className="isolate flex flex-1 flex-col">
      <Hero />
      <ProjectShowcase id="work" title="Selected Product Design Works" projects={productProjects} />
      <HorizontalShowcase id="ai-work" title="AI / Design System Work" projects={aiProjects} />
      <SkillSets />
    </main>
  );
}
