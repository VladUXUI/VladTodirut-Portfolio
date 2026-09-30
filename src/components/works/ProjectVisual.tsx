import Image from "next/image";
import type { Project } from "@/content/projects";

/* Project image, or a placeholder card until the real image exists */
export function ProjectVisual({
  project,
  sizes,
  fit = "contain",
}: {
  project: Project;
  sizes: string;
  fit?: "contain" | "cover";
}) {
  if (project.image) {
    return (
      <Image
        src={project.image}
        alt={`${project.title} project preview`}
        fill
        sizes={sizes}
        className={fit === "cover" ? "rounded-xl object-cover" : "object-contain"}
      />
    );
  }
  return (
    <div className="flex size-full items-center justify-center rounded-xl bg-surface">
      <span className="px-24 text-center text-lead font-medium text-bg/20">{project.title}</span>
    </div>
  );
}
