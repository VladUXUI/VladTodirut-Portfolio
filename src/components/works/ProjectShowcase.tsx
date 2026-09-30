"use client";

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { getImageProps } from "next/image";
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useMotionValueEvent,
  useInView,
  useScroll,
} from "motion/react";
import type { Project } from "@/content/projects";
import { CaseStudyLink } from "@/components/ui/CaseStudyLink";
import { EASE_OUT } from "@/components/intro/timeline";
import { Container } from "@/components/ui/Container";
import { ProjectVisual } from "./ProjectVisual";
import { SectionHeading } from "./SectionHeading";

const DESKTOP_IMAGE_SIZES = "(min-width: 1024px) 44vw, 100vw";

/* Scroll distance each project stays active for (desktop) */
const SCROLL_PER_PROJECT = "35vh";
/* Distance from the viewport top where the image + list pin */
const PIN_TOP = 96;

const pad = (n: number) => String(n + 1).padStart(2, "0");

/* Static class names so Tailwind can see them */
const ACCENTS = {
  blue: { bar: "bg-accent-blue", text: "text-accent-blue" },
  green: { bar: "bg-accent-green", text: "text-accent-green" },
} as const;

type Accent = (typeof ACCENTS)[keyof typeof ACCENTS];

export type ProjectShowcaseProps = {
  id: string;
  title: string;
  projects: Project[];
  accent?: keyof typeof ACCENTS;
  /** Side the image sits on (desktop) */
  imageSide?: "left" | "right";
};

export function ProjectShowcase({
  id,
  title,
  projects,
  accent = "blue",
  imageSide = "left",
}: ProjectShowcaseProps) {
  const colors = ACCENTS[accent];
  return (
    <MotionConfig reducedMotion="user">
      <Container as="section" id={id} className="pt-96 lg:pt-128">
        <SectionHeading barClass={colors.bar}>{title}</SectionHeading>

        <DesktopWorks projects={projects} colors={colors} imageSide={imageSide} />
        <MobileWorks projects={projects} />
      </Container>
    </MotionConfig>
  );
}

/* ---------- Desktop: pinned image + list, active project follows scroll ---------- */

function DesktopWorks({
  projects,
  colors,
  imageSide,
}: {
  projects: Project[];
  colors: Accent;
  imageSide: "left" | "right";
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = projects.length;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: [`start ${PIN_TOP}px`, "end end"],
  });

  // Only the active image is mounted, so fetch the others as the section nears
  const nearby = useInView(trackRef, { once: true, margin: "100% 0px" });
  useEffect(() => {
    if (!nearby) return;
    for (const { image } of projects) {
      if (!image) continue;
      const { props } = getImageProps({ src: image, alt: "", fill: true, sizes: DESKTOP_IMAGE_SIZES });
      preload(props.src, { as: "image", imageSrcSet: props.srcSet, imageSizes: props.sizes });
    }
  }, [nearby, projects]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setActive(Math.min(count - 1, Math.max(0, Math.floor(progress * count))));
  });

  // Jump to the middle of a project's scroll segment
  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY - PIN_TOP;
    const distance = track.offsetHeight - (window.innerHeight - PIN_TOP);
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
      className="relative mt-64 hidden lg:block"
      style={{ height: `calc(100dvh - ${PIN_TOP}px + ${count} * ${SCROLL_PER_PROJECT})` }}
    >
      <div className="sticky flex items-start" style={{ top: PIN_TOP, height: `calc(100dvh - ${PIN_TOP}px)` }}>
        <div
          className={`grid w-full items-start gap-64 xl:gap-128 ${
            imageSide === "left"
              ? "grid-cols-[minmax(0,752fr)_minmax(0,706fr)]"
              : "grid-cols-[minmax(0,706fr)_minmax(0,752fr)]"
          }`}
        >
          <div className={imageSide === "right" ? "order-last" : undefined}>
            <ProjectImage project={projects[active]} />
          </div>

          <ol className="flex flex-col">
            {projects.map((project, i) => (
              <ProjectRow
                key={project.slug}
                project={project}
                index={i}
                active={i === active}
                activeClass={colors.text}
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
          <ProjectVisual project={project} sizes={DESKTOP_IMAGE_SIZES} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ProjectRow({
  project,
  index,
  active,
  activeClass,
  onSelect,
}: {
  project: Project;
  index: number;
  active: boolean;
  activeClass: string;
  onSelect: () => void;
}) {
  return (
    <li className="border-b border-dot" aria-current={active ? "true" : undefined}>
      <div className="flex flex-wrap items-center justify-between gap-x-24 gap-y-8 py-16">
        <button
          type="button"
          onClick={onSelect}
          className="flex cursor-pointer items-baseline gap-8 text-left focus-visible:outline-none"
        >
          <span className="w-32 shrink-0 text-body font-medium text-fg-dim">{pad(index)}.</span>
          <span
            className={`text-title-xl font-medium whitespace-nowrap transition-[margin-left,color] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
              active ? `ml-40 ${activeClass}` : "text-fg hover:text-fg-muted"
            }`}
          >
            {project.title}
          </span>
        </button>

        {/* Tags hide while the project is active */}
        <AnimatePresence initial={false}>
          {!active && (
            <motion.p
              key="tags"
              className="ml-auto max-w-[280px] text-right text-body font-light tracking-tag text-fg-dim"
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
            <div className="flex flex-col items-start gap-24 pb-40 pl-80">
              <p className="max-w-[613px] text-body font-light tracking-tag text-fg-dim">
                {project.description}
              </p>
              <CaseStudyLink href={`/work/${project.slug}`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/* ---------- Mobile / tablet: simple stacked cards ---------- */

function MobileWorks({ projects }: { projects: Project[] }) {
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
