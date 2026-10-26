"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, type TargetAndTransition } from "motion/react";

/*
 * Mezo card: the dashboard assembles itself over the background. Each layer
 * lands on its position in the 1504 × 1532 card art (measured from the final
 * composition), so the end state matches the static design exactly.
 */
const CARD = { w: 1504, h: 1532 };
const DIR = "/images/work/Mezo";

type Layer = {
  file: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Where the layer starts before landing */
  from: TargetAndTransition;
  delay: number;
};

// Listed bottom to top
const LAYERS: Layer[] = [
  { file: "Table.png", x: 94, y: 710, w: 866, h: 478, from: { y: "12%" }, delay: 0.35 },
  { file: "main_card.png", x: 35, y: 238, w: 984, h: 529, from: { y: "8%", scale: 0.94 }, delay: 0.15 },
  { file: "friends.png", x: 991, y: 270, w: 416, h: 378, from: { x: "30%" }, delay: 0.45 },
  { file: "ens.png", x: 991, y: 680, w: 416, h: 232, from: { x: "30%" }, delay: 0.55 },
  { file: "rank.png", x: 991, y: 944, w: 416, h: 335, from: { x: "30%" }, delay: 0.65 },
  { file: "Top menu.png", x: 59, y: 112, w: 1384, h: 160, from: { y: "-60%" }, delay: 0 },
];

const LANDED = { opacity: 1, x: 0, y: 0, scale: 1 };
const SPRING = { type: "spring", stiffness: 140, damping: 20, mass: 0.9 } as const;

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

/* `active` comes from the desktop showcase; without it, plays when scrolled into view */
export function MezoLayers({ active }: { active?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const play = active ?? inView;

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0">
      {LAYERS.map((layer) => {
        const share = layer.w / CARD.w;
        return (
          <motion.div
            key={layer.file}
            className="absolute"
            style={{
              left: pct(layer.x, CARD.w),
              top: pct(layer.y, CARD.h),
              width: pct(layer.w, CARD.w),
              aspectRatio: `${layer.w} / ${layer.h}`,
            }}
            initial={false}
            animate={play ? { ...LANDED, transition: { ...SPRING, delay: layer.delay } } : { opacity: 0, ...layer.from, transition: { duration: 0 } }}
          >
            <Image
              src={encodeURI(`${DIR}/${layer.file}`)}
              alt=""
              fill
              sizes={`(min-width: 1024px) ${Math.ceil(44 * share)}vw, ${Math.ceil(100 * share)}vw`}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
