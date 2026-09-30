"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import type { Project } from "@/content/projects";
import { CaseStudyLink } from "@/components/ui/CaseStudyLink";
import { Container } from "@/components/ui/Container";
import { EASE_OUT } from "@/components/intro/timeline";
import { ProjectVisual } from "./ProjectVisual";
import { SectionHeading } from "./SectionHeading";

/* Vertical scroll distance that moves the track by one card */
const SCROLL_PER_SLIDE = "60vh";
/* Distance from the viewport top where the track pins */
const PIN_TOP = 96;
/* Space between cards (Figma: 101px) */
const GAP = 96;
/*
 * Card width: Figma size (1258 × 766), but never so tall that the text block
 * (~310px) falls off-screen while pinned, and narrow enough for the next card
 * to peek in on the right.
 */
const CARD_WIDTH = "min(1258px, 72vw, calc((100dvh - 440px) * 1258 / 766))";

const pad = (n: number) => String(n + 1).padStart(2, "0");

export function HorizontalShowcase({
  id,
  title,
  projects,
}: {
  id: string;
  title: string;
  projects: Project[];
}) {
  return (
    // Cards slide past the container edges; clip at the viewport instead
    <section id={id} className="overflow-x-clip">
      <Container className="pt-96 lg:pt-128">
        <SectionHeading barClass="bg-accent-purple" fullBar>
          {title}
        </SectionHeading>

        <PinnedTrack projects={projects} />
        <SwipeTrack projects={projects} />
      </Container>
    </section>
  );
}

/* ---------- Desktop: vertical scroll drives the track sideways ---------- */

function PinnedTrack({ projects }: { projects: Project[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const count = projects.length;

  // Distance between card starts (card width + gap), kept in sync on resize
  const step = useMotionValue(0);
  useEffect(() => {
    const card = firstCardRef.current;
    if (!card) return;
    const measure = () => step.set(card.offsetWidth + GAP);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(card);
    return () => observer.disconnect();
  }, [step]);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: [`start ${PIN_TOP}px`, "end end"],
  });
  const x = useTransform(() => -scrollYProgress.get() * (count - 1) * step.get());

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setActive(Math.round(progress * (count - 1)));
  });

  // Bring a card into view (used when a card's link receives keyboard focus)
  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track || index === active) return;
    const start = track.getBoundingClientRect().top + window.scrollY - PIN_TOP;
    const distance = track.offsetHeight - (window.innerHeight - PIN_TOP);
    animate(window.scrollY, start + (index / (count - 1)) * distance, {
      duration: 0.9,
      ease: EASE_OUT,
      onUpdate: (y) => window.scrollTo(0, y),
    });
  };

  return (
    <div
      ref={trackRef}
      className="relative mt-64 hidden lg:motion-safe:block"
      style={{ height: `calc(100dvh - ${PIN_TOP}px + ${count - 1} * ${SCROLL_PER_SLIDE})` }}
    >
      {/* Snap points: one per card, so scrolling settles on a card */}
      {projects.map((project, i) => (
        <div
          key={project.slug}
          aria-hidden
          className="absolute inset-x-0 h-0 snap-start"
          style={{ top: `calc(${i} * ${SCROLL_PER_SLIDE})`, scrollMarginTop: PIN_TOP }}
        />
      ))}

      <div className="sticky" style={{ top: PIN_TOP, height: `calc(100dvh - ${PIN_TOP}px)` }}>
        <motion.div className="flex items-start" style={{ x, gap: GAP }}>
          {projects.map((project, i) => (
            <Card
              key={project.slug}
              ref={i === 0 ? firstCardRef : undefined}
              project={project}
              index={i}
              active={i === active}
              onFocus={() => goTo(i)}
              style={{ width: CARD_WIDTH }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ---------- Mobile + reduced motion: native swipe carousel ---------- */

function SwipeTrack({ projects }: { projects: Project[] }) {
  return (
    <div className="-mx-24 mt-48 flex snap-x snap-mandatory scroll-px-24 gap-24 overflow-x-auto px-24 pb-16 lg:scroll-px-64 [scrollbar-width:none] lg:-mx-64 lg:mt-64 lg:gap-96 lg:px-64 lg:motion-safe:hidden">
      {projects.map((project, i) => (
        <Card
          key={project.slug}
          project={project}
          index={i}
          active
          className="w-[85%] snap-start lg:w-[72%]"
        />
      ))}
    </div>
  );
}

/* ---------- Card ---------- */

function Card({
  ref,
  project,
  index,
  active,
  onFocus,
  className = "",
  style,
}: {
  ref?: React.Ref<HTMLElement>;
  project: Project;
  index: number;
  active: boolean;
  onFocus?: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <article
      ref={ref}
      onFocus={onFocus}
      style={style}
      className={`shrink-0 transition-opacity duration-500 ${active ? "opacity-100" : "opacity-20"} ${className}`}
    >
      <div className="relative aspect-[1258/766] w-full">
        <ProjectVisual project={project} sizes="(min-width: 1024px) 72vw, 85vw" fit="cover" />
      </div>

      <div className="mt-24 max-w-[1126px] border-b border-dot">
        <div className="flex items-baseline gap-24 py-16 lg:gap-48">
          <span className="w-32 shrink-0 text-body font-medium text-fg-dim">{pad(index)}.</span>
          <h3
            className={`text-title-xl font-medium transition-colors duration-500 ${
              active ? "text-accent-purple" : "text-fg"
            }`}
          >
            {project.title}
          </h3>
        </div>
        <div className="flex flex-col items-start gap-32 pb-40 pl-56 lg:pl-80">
          <p className="max-w-[613px] text-body font-light tracking-tag text-fg-dim">
            {project.description}
          </p>
          <CaseStudyLink href={`/work/${project.slug}`} />
        </div>
      </div>
    </article>
  );
}
