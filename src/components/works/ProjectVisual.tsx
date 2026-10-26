import Image from "next/image";
import type { Project } from "@/content/projects";
import { PipSinging } from "./PipSinging";
import { TahoSigning } from "./TahoSigning";
import { MezoLayers } from "./MezoLayers";
import { CardVideo } from "./CardVideo";

/* Project image, or a placeholder card until the real image exists */
export function ProjectVisual({
  project,
  sizes,
  fit = "contain",
  rounded = true,
  active,
}: {
  project: Project;
  sizes: string;
  fit?: "contain" | "cover";
  /** Rounded card corners (the AI / design system cards are square) */
  rounded?: boolean;
  /** Whether this card is the one showing (desktop showcase); drives entrance animations */
  active?: boolean;
}) {
  const radius = rounded ? "rounded-xl" : "";
  if (project.video) {
    return <CardVideo {...project.video} active={active} />;
  }
  if (project.image) {
    return (
      <>
        <Image
          src={project.image}
          alt={`${project.title} project preview`}
          fill
          sizes={sizes}
          className={`${radius} ${fit === "cover" ? "object-cover" : "object-contain"}`}
        />
        {project.overlay === "pip" && (
          // Positioned where Pip sits in the 1504 × 1532 card art; clipped at the card edge
          <div className={`pointer-events-none absolute inset-0 overflow-clip ${radius}`}>
            <PipSinging className="absolute" style={{ left: "74.93%", top: "66.12%", width: "30.52%" }} />
          </div>
        )}
        {project.overlay === "taho-signing" && <TahoSigning />}
        {project.overlay === "mezo-layers" && <MezoLayers active={active} />}
      </>
    );
  }
  return (
    <div className={`flex size-full items-center justify-center bg-surface ${radius}`}>
      <span className="px-24 text-center text-lead font-medium text-bg/20">{project.title}</span>
    </div>
  );
}
