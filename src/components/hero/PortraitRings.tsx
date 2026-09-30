"use client";

import { useEffect, useId } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

/*
 * Geometry is in Figma frame coordinates (node 444:365), so values can be
 * compared 1:1 with the design. The viewBox crops to the portrait area.
 */
const VIEWBOX = "900 60 720 880";

const PORTRAIT = {
  // Image fill box (mirrored horizontally in Figma)
  x: 872.38,
  y: 32.43,
  width: 665.18,
  height: 1001.51,
  // Oval "Subtract" shape the image is clipped to
  shapeX: 950,
  shapeY: 79.35,
  shapePath:
    "M299.389 0C397.972 0 488.234 35.629 558 94.713V591.18C520.079 684.308 462.565 786.988 299.389 839.162C98.095 903.524 43.436 772.911 0 631.819V134.53C73.342 51.998 180.293 0 299.389 0Z",
};

const RING = { cx: 1259, rx: 356, ry: 83 };
const RING_REST_CY = [709, 757, 797]; // top → bottom

/* ---- Animation tuning ---- */
const START_OFFSET = 360; // rings start this far below their resting spot
const PEAK_OFFSET = -620; // how far above rest the top ring travels (past the head)
const RISE = { duration: 1.4, ease: [0.33, 0, 0.2, 1] as const };
const STAGGER = 0.09; // seconds between rings
const SETTLE = { type: "spring", stiffness: 70, damping: 13, mass: 1 } as const;
const IDLE_AMPLITUDE = 5;

// Lower half of an ellipse, drawn right → left through the bottom
const frontArc = (cy: number) =>
  `M${RING.cx + RING.rx} ${cy}A${RING.rx} ${RING.ry} 0 0 1 ${RING.cx - RING.rx} ${cy}`;

export function PortraitRings({ className }: { className?: string }) {
  const id = useId();
  const clipId = `${id}-shape`;
  const maskId = `${id}-reveal`;
  const reduceMotion = useReducedMotion();

  // Vertical offset of each ring from its resting position
  const r0 = useMotionValue(START_OFFSET);
  const r1 = useMotionValue(START_OFFSET);
  const r2 = useMotionValue(START_OFFSET);
  const rings = [r0, r1, r2];
  const opacity = useMotionValue(0);

  // Edge of the revealed area (y of the lead ring's centre). Only ever moves
  // up, so the portrait stays visible when the rings drop back down.
  const revealCy = useMotionValue(RING_REST_CY[0] + START_OFFSET);

  useEffect(() => {
    if (reduceMotion) {
      rings.forEach((ring) => ring.set(0));
      opacity.set(1);
      revealCy.set(-1000);
      return;
    }

    const unsubscribe = r0.on("change", (offset) => {
      const cy = RING_REST_CY[0] + offset;
      if (cy < revealCy.get()) revealCy.set(cy);
    });

    const controls: { stop: () => void }[] = [];
    let cancelled = false;

    controls.push(animate(opacity, 1, { duration: 0.4 }));

    rings.forEach((ring, i) => {
      const delay = i * STAGGER;
      const rise = animate(ring, PEAK_OFFSET, { ...RISE, delay });
      controls.push(rise);
      rise.then(() => {
        if (cancelled) return;
        const settle = animate(ring, 0, SETTLE);
        controls.push(settle);
        settle.then(() => {
          if (cancelled) return;
          // Gentle idle float, out of phase per ring
          controls.push(
            animate(ring, [0, -IDLE_AMPLITUDE, 0], {
              duration: 4 + i * 0.7,
              ease: "easeInOut",
              repeat: Infinity,
            }),
          );
        });
      });
    });

    return () => {
      cancelled = true;
      unsubscribe();
      controls.forEach((c) => c.stop());
    };
    // Motion values are stable; run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  return (
    <svg
      viewBox={VIEWBOX}
      overflow="visible"
      className={className}
      role="img"
      aria-label="Portrait of Vlad Todirut"
    >
      <defs>
        <clipPath id={clipId}>
          <path
            d={PORTRAIT.shapePath}
            transform={`translate(${PORTRAIT.shapeX} ${PORTRAIT.shapeY})`}
          />
        </clipPath>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="-2000" width="3000" height="5000">
          {/* Everything below the lead ring's upper arc is revealed */}
          <motion.rect x="0" y={revealCy} width="3000" height="3000" fill="white" />
          <motion.ellipse cx={RING.cx} cy={revealCy} rx={RING.rx} ry={RING.ry} fill="white" />
        </mask>
      </defs>

      {/* Back rings — behind the portrait */}
      <motion.g style={{ opacity }}>
        {rings.map((ring, i) => (
          <RingGroup key={i} offset={ring}>
            <ellipse
              cx={RING.cx}
              cy={RING_REST_CY[i]}
              rx={RING.rx}
              ry={RING.ry}
              fill="none"
              stroke="var(--color-accent-lime)"
              strokeWidth={2}
            />
          </RingGroup>
        ))}
      </motion.g>

      {/* Portrait */}
      <g clipPath={`url(#${clipId})`}>
        <g mask={`url(#${maskId})`}>
          <image
            href="/images/hero/portrait.png"
            x={PORTRAIT.x}
            y={PORTRAIT.y}
            width={PORTRAIT.width}
            height={PORTRAIT.height}
            preserveAspectRatio="xMidYMid slice"
            transform={`translate(${2 * PORTRAIT.x + PORTRAIT.width} 0) scale(-1 1)`}
          />
        </g>
      </g>

      {/* Front arcs — over the portrait */}
      <motion.g style={{ opacity }}>
        {rings.map((ring, i) => (
          <RingGroup key={i} offset={ring}>
            <path
              d={frontArc(RING_REST_CY[i])}
              fill="none"
              stroke="var(--color-accent-lime)"
              strokeWidth={2}
            />
          </RingGroup>
        ))}
      </motion.g>
    </svg>
  );
}

function RingGroup({
  offset,
  children,
}: {
  offset: MotionValue<number>;
  children: React.ReactNode;
}) {
  return <motion.g style={{ y: offset }}>{children}</motion.g>;
}
