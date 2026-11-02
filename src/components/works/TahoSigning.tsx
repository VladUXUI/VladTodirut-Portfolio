"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, type TargetAndTransition } from "motion/react";

/*
 * Taho card: the signing screen builds itself in the order people check it:
 * what am I signing → who with → how my wallet changes → fee → confirm.
 * The empty screen (bg.png) sits exactly over the middle screen baked into
 * the 1504 × 1532 card art, so the blocks land on a clean background.
 * Layer positions are in the screen's own 768 × 1200 pixels.
 */
const CARD = { w: 1504, h: 1532 };
const SCREEN = { x: 364, y: 137, w: 805, h: 1258 };
const BG = { w: 768, h: 1200 };
const DIR = "/images/work/Taho";
/* bg.png's corner radius, so the bottom bar's corners follow the screen */
const RADIUS = 32;

type Layer = {
  file: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Where the layer starts before landing */
  from: TargetAndTransition;
  delay: number;
  /** Round the bottom corners to match the screen */
  roundBottom?: boolean;
};

const LAYERS: Layer[] = [
  { file: "top-menu.png", x: 0, y: 0, w: 768, h: 132, from: { y: "-60%" }, delay: 0 },
  { file: "title.png", x: 32, y: 129, w: 704, h: 64, from: { y: "40%" }, delay: 0.2 },
  { file: "interacting.png", x: 32, y: 224, w: 704, h: 208, from: { y: "20%", scale: 0.96 }, delay: 0.45 },
  { file: "balance-change.png", x: 32, y: 436, w: 704, h: 272, from: { y: "20%", scale: 0.96 }, delay: 0.7 },
  { file: "network-fee.png", x: 32, y: 740, w: 704, h: 48, from: { y: "40%" }, delay: 0.95 },
  { file: "cta.png", x: 0, y: 1030, w: 768, h: 170, from: { y: "60%" }, delay: 1.15, roundBottom: true },
];

const LANDED = { opacity: 1, x: 0, y: 0, scale: 1 };
const SPRING = { type: "spring", stiffness: 140, damping: 20, mass: 0.9 } as const;

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

/* `active` comes from the desktop showcase; without it, plays when scrolled into view */
export function TahoSigning({ active }: { active?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const play = active ?? inView;
  const share = SCREEN.w / CARD.w;

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0">
      <div
        className="absolute"
        style={{
          left: pct(SCREEN.x, CARD.w),
          top: pct(SCREEN.y, CARD.h),
          width: pct(SCREEN.w, CARD.w),
          height: pct(SCREEN.h, CARD.h),
        }}
      >
        <Image
          src={`${DIR}/bg.png`}
          alt=""
          fill
          sizes={`(min-width: 1024px) ${Math.ceil(44 * share)}vw, ${Math.ceil(100 * share)}vw`}
        />
        {LAYERS.map((layer) => (
          <motion.div
            key={layer.file}
            className="absolute"
            style={{
              left: pct(layer.x, BG.w),
              top: pct(layer.y, BG.h),
              width: pct(layer.w, BG.w),
              aspectRatio: `${layer.w} / ${layer.h}`,
              ...(layer.roundBottom && {
                overflow: "hidden",
                borderRadius: `0 0 ${pct(RADIUS, layer.w)} ${pct(RADIUS, layer.w)} / 0 0 ${pct(RADIUS, layer.h)} ${pct(RADIUS, layer.h)}`,
              }),
            }}
            initial={false}
            animate={
              play
                ? { ...LANDED, transition: { ...SPRING, delay: layer.delay } }
                : { opacity: 0, ...layer.from, transition: { duration: 0 } }
            }
          >
            <Image
              src={`${DIR}/${layer.file}`}
              alt=""
              fill
              sizes={`(min-width: 1024px) ${Math.ceil(44 * share * (layer.w / BG.w))}vw, ${Math.ceil(100 * share * (layer.w / BG.w))}vw`}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
