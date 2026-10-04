import type { ComponentType } from "react";
import type { StaticImageData } from "next/image";

/* Projects that have a written case study (src/content/case-studies/<slug>.mdx) */
export const caseStudySlugs = ["mezo", "echoes"] as const;

export type CaseStudyMeta = {
  summary: string;
  hero: StaticImageData;
  heroAlt: string;
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
