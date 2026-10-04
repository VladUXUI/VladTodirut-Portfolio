import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { aiProjects, productProjects } from "@/content/projects";
import { caseStudySlugs, hasCaseStudy, loadCaseStudy } from "@/content/case-studies";
import { CaseStudyLink } from "@/components/ui/CaseStudyLink";
import { Container } from "@/components/ui/Container";
import { Video } from "@/components/case-study/Video";

const allProjects = [...productProjects, ...aiProjects];
const pad = (n: number) => String(n + 1).padStart(2, "0");

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = allProjects.find((p) => p.slug === slug);
  if (!project) return {};
  const { meta } = await loadCaseStudy(slug);
  return {
    title: `${project.title} case study — Vlad Todirut`,
    description: meta.summary,
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = allProjects.find((p) => p.slug === slug);
  if (!project || !hasCaseStudy(slug)) notFound();

  const { default: Content, meta } = await loadCaseStudy(slug);
  const list = productProjects.includes(project) ? productProjects : aiProjects;
  const index = list.indexOf(project);

  // Next written case study in the same list (wraps around); none if this is the only one
  const next = [...list.slice(index + 1), ...list.slice(0, index)].find((p) => hasCaseStudy(p.slug));

  return (
    <main className="flex flex-1 flex-col">
      <Container as="header" className="flex flex-col gap-24 pt-160 lg:pt-192">
        <div className="flex items-baseline gap-16">
          <span className="text-label font-mono text-fg-mono">{pad(index)}.</span>
          <span className="text-body tracking-tag text-fg-dim">{project.tags}</span>
        </div>
        <h1 className="text-display font-medium text-accent-blue">{project.title}</h1>
        {meta.link && (
          <div>
            <CaseStudyLink href={meta.link.href} label={meta.link.label} external />
          </div>
        )}
      </Container>

      <Container className="mt-64">
        {meta.heroVideo ? (
          <Video {...meta.heroVideo} label={meta.heroAlt} className="rounded-xl" />
        ) : meta.hero ? (
          <Image
            src={meta.hero}
            alt={meta.heroAlt}
            preload
            placeholder="blur"
            sizes="(min-width: 1728px) 1600px, 100vw"
            className="h-auto w-full rounded-xl"
          />
        ) : null}
      </Container>

      <Container as="section" className="mt-96">
        <article className="mx-auto flex max-w-[1100px] flex-col gap-24">
          <Content />
        </article>
      </Container>

      <Container className="mt-128">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-end justify-between gap-24 border-t border-dot pt-48">
          {next ? (
            <Link href={`/work/${next.slug}`} className="group flex flex-col gap-8">
              <span className="text-label font-mono uppercase text-accent-lime">Next project</span>
              <span className="text-title-xl font-medium transition-colors group-hover:text-accent-lime">
                {next.title} →
              </span>
            </Link>
          ) : (
            <span className="text-body text-fg-dim">More case studies coming soon.</span>
          )}
          <Link
            href="/#work"
            className="text-cta tracking-tag text-fg transition-colors hover:text-accent-lime"
          >
            ← All work
          </Link>
        </div>
      </Container>
    </main>
  );
}
