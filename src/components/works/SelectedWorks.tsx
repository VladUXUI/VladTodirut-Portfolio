"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { projects, type Project } from "@/content/projects";
import { CaseStudyLink } from "@/components/ui/CaseStudyLink";
import { EASE_OUT } from "@/components/intro/timeline";
import { Container } from "@/components/ui/Container";

/* Scroll distance each project stays active for (desktop) */
const SCROLL_PER_PROJECT = "35vh";

const pad = (n: number) => String(n + 1).padStart(2, "0");

export function SelectedWorks() {
  return (
    <MotionConfig reducedMotion="user">
      <Container as="section" id="work" className="pt-96 lg:pt-128">
        <h2 className="flex flex-col items-start gap-24 text-title-2xl font-medium">
          Selected Product Design Works
          <span className="h-16 w-full max-w-[738px] bg-accent-blue" aria-hidden />
        </h2>

        <DesktopWorks />
        <MobileWorks />
      </Container>
    </MotionConfig>
  );
}

/* ---------- Desktop: pinned image + list, active project follows scroll ---------- */

function DesktopWorks() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = projects.length;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setActive(Math.min(count - 1, Math.max(0, Math.floor(progress * count))));
  });

  // Jump to the middle of a project's scroll segment
  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const distance = track.offsetHeight - window.innerHeight;
    const target = top + ((index + 0.5) / count) * distance;
    // Native smooth scroll gets cut short as rows re-layout mid-scroll
    animate(window.scrollY, target, {
      duration: 0.9,
      ease: EASE_OUT,
      onUpdate: (y) => window.scrollTo(0, y),
    });
  };

  return (
    <div
      ref={trackRef}
      className="relative hidden lg:block"
      style={{ height: `calc(100dvh + ${count} * ${SCROLL_PER_PROJECT})` }}
    >
      <div className="sticky top-0 flex h-dvh items-center">
        <div className="grid w-full grid-cols-[minmax(0,752fr)_minmax(0,706fr)] items-center gap-64 xl:gap-128">
          <ProjectImage project={projects[active]} />

          <ol className="flex flex-col">
            {projects.map((project, i) => (
              <ProjectRow
                key={project.slug}
                project={project}
                index={i}
                active={i === active}
                onSelect={() => goTo(i)}
              />
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function ProjectImage({ project }: { project: Project }) {
  return (
    <div className="relative aspect-[752/766] w-full">
      <AnimatePresence initial={false}>
        <motion.div
          key={project.slug}
          className="absolute inset-0"
          initial={{ clipPath: "inset(100% 0% 0% 0% round 40px)", scale: 1.04 }}
          animate={{ clipPath: "inset(0% 0% 0% 0% round 40px)", scale: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2, delay: 0.5 } }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          <ProjectVisual project={project} sizes="(min-width: 1024px) 44vw, 100vw" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ProjectRow({
  project,
  index,
  active,
  onSelect,
}: {
  project: Project;
  index: number;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <li className="border-b border-dot" aria-current={active ? "true" : undefined}>
      <div className="flex items-center justify-between gap-24 py-16">
        <button
          type="button"
          onClick={onSelect}
          className="flex cursor-pointer items-baseline gap-8 text-left focus-visible:outline-none"
        >
          <span className="w-32 shrink-0 text-body font-medium text-fg-dim">{pad(index)}.</span>
          <span
            className={`text-title-xl font-medium whitespace-nowrap transition-[margin-left,color] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
              active ? "ml-40 text-accent-blue" : "text-fg hover:text-fg-muted"
            }`}
          >
            {project.title}
          </span>
        </button>

        {/* Tags ↔ CTA share one cell so the row never changes height */}
        <div className="grid min-w-0 justify-items-end [&>*]:col-start-1 [&>*]:row-start-1">
          <AnimatePresence initial={false}>
            {active ? (
              <motion.div
                key="cta"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
              >
                <CaseStudyLink href={`/work/${project.slug}`} />
              </motion.div>
            ) : (
              <motion.p
                key="tags"
                className="max-w-[280px] text-right text-body font-light tracking-tag text-fg-dim"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {project.tags}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            key="body"
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            <p className="max-w-[613px] pb-40 pl-80 text-body font-light tracking-tag text-fg-dim">
              {project.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/* ---------- Mobile / tablet: simple stacked cards ---------- */

function MobileWorks() {
  return (
    <ol className="mt-48 flex flex-col gap-64 lg:hidden">
      {projects.map((project, i) => (
        <li key={project.slug} className="flex flex-col gap-24">
          <div className="relative aspect-[752/766] w-full">
            <ProjectVisual project={project} sizes="100vw" />
          </div>
          <div className="flex items-baseline gap-8">
            <span className="text-body font-medium text-fg-dim">{pad(i)}.</span>
            <h3 className="text-title-xl font-medium">{project.title}</h3>
          </div>
          <p className="text-body font-light tracking-tag text-fg-dim">{project.tags}</p>
          <p className="text-body font-light tracking-tag text-fg-dim">{project.description}</p>
          <CaseStudyLink href={`/work/${project.slug}`} />
        </li>
      ))}
    </ol>
  );
}

/* ---------- Shared ---------- */

function ProjectVisual({ project, sizes }: { project: Project; sizes: string }) {
  if (project.image) {
    return (
      <Image
        src={project.image}
        alt={`${project.title} project preview`}
        fill
        sizes={sizes}
        className="object-contain"
      />
    );
  }
  // Placeholder until the real image exists
  return (
    <div className="flex size-full items-center justify-center rounded-xl bg-surface">
      <span className="text-title-xl font-medium text-bg/20">{project.title}</span>
    </div>
  );
}
