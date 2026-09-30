"use client";

import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { useIntro } from "./IntroProvider";
import { SQUIGGLE_PATH, SQUIGGLE_VIEWBOX } from "./squiggle";

/* Assets the first screen needs before the intro can play */
const PRELOAD_IMAGES = ["/images/hero/portrait.png"];
const MIN_DURATION = 900; // ms — avoid a flash on fast connections
const MAX_DURATION = 5000; // ms — never block the site longer than this

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const preloadImage = (src: string) => {
  const img = new Image();
  img.src = src;
  return img.decode().catch(() => {});
};

export function Loader() {
  const { setReady } = useIntro();
  const reduce = useReducedMotion();
  const [gone, setGone] = useState(false);

  const length = useMotionValue(0);
  const offset = useMotionValue(0);
  const opacity = useMotionValue(1);

  useEffect(() => {
    if (reduce) return; // provider reports ready immediately

    const root = document.documentElement;
    root.style.overflow = "hidden";
    let cancelled = false;

    // Draw most of the line while we wait; the rest lands once assets are in
    const progress = animate(length, 0.85, { duration: 1.6, ease: [0.3, 0, 0.2, 1] });

    const assets = Promise.all([
      document.fonts.ready,
      ...PRELOAD_IMAGES.map(preloadImage),
      wait(MIN_DURATION),
    ]);

    Promise.race([assets, wait(MAX_DURATION)]).then(async () => {
      if (cancelled) return;
      progress.stop();
      await animate(length, 1, { duration: 0.35, ease: "easeOut" });
      if (cancelled) return;
      // Line slides out to the right
      await animate(offset, 1, { duration: 0.45, ease: [0.6, 0, 0.8, 0.4] });
      if (cancelled) return;
      setReady(true); // intro starts while the overlay fades
      root.style.overflow = "";
      await animate(opacity, 0, { duration: 0.5, ease: "easeOut" });
      if (!cancelled) setGone(true);
    });

    return () => {
      cancelled = true;
      progress.stop();
      root.style.overflow = "";
    };
  }, [reduce, setReady, length, offset, opacity]);

  if (gone) return null;

  return (
    <motion.div
      id="site-loader"
      role="status"
      aria-label="Loading"
      style={{ opacity }}
      className="bg-dots fixed inset-0 z-50 grid place-items-center bg-bg motion-reduce:hidden"
    >
      <svg
        viewBox={SQUIGGLE_VIEWBOX}
        fill="none"
        overflow="visible"
        className="w-[clamp(200px,28vw,420px)]"
        aria-hidden
      >
        <motion.path
          d={SQUIGGLE_PATH}
          stroke="var(--color-accent-blue)"
          strokeWidth={2.5}
          strokeLinecap="round"
          style={{ pathLength: length, pathOffset: offset }}
        />
      </svg>
    </motion.div>
  );
}
