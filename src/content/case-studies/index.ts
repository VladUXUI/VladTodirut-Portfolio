import type { ComponentType } from "react";
import type { StaticImageData } from "next/image";

/* Projects that have a written case study (src/content/case-studies/<slug>.mdx) */
export const caseStudySlugs = ["mezo", "echoes", "taho", "subscape"] as const;

export type CaseStudyMeta = {
  summary: string;
  /** Hero image, or `heroVideo` for a looping clip instead */
  hero?: StaticImageData;
  heroAlt: string;
  heroVideo?: { src: string; poster: string; width: number; height: number };
  /** Optional external link shown in the header, e.g. a prototype */
  link?: { label: string; href: string };
};

export type CaseStudyModule = {
  default: ComponentType;
  meta: CaseStudyMeta;
};

export const hasCaseStudy = (slug: string) =>
  (caseStudySlugs as readonly string[]).includes(slug);

export const loadCaseStudy = (slug: string): Promise<CaseStudyModule> =>
  import(`./${slug}.mdx`);
