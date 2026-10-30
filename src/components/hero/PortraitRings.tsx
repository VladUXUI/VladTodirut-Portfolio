"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useIntroReady } from "@/components/intro/IntroProvider";
import { INTRO } from "@/components/intro/timeline";

/*
 * Geometry is in Figma frame coordinates (node 444:365), so values can be
 * compared 1:1 with the design. The viewBox crops to the portrait area.
 */
const VIEWBOX = { x: 900, y: 60, width: 720, height: 880 };
// Motion ignores transformOrigin on SVG elements; it only honours originX/originY.
// With transform-box: view-box these are plain viewBox coordinates.
const origin = (x: number, y: number) => ({
  transformBox: "view-box" as const,
  originX: `${x}px`,
  originY: `${y}px`,
});

const PORTRAIT = {
  // Image box for the expression cut-outs (1086×1448, same framing for all)
  x: 880,
  y: 90,
  width: 698,
  height: 931,
  // Oval "Subtract" shape the image is clipped to
  shapeX: 950,
  shapeY: 79.35,
  shapePath:
    "M299.389 0C397.972 0 488.234 35.629 558 94.713V591.18C520.079 684.308 462.565 786.988 299.389 839.162C98.095 903.524 43.436 772.911 0 631.819V134.53C73.342 51.998 180.293 0 299.389 0Z",
};

/*
 * Cut-outs from the "Portraits" frame in Figma (node 523:598). Startled and
 * skeptical look to the left in the source photo; they get mirrored when the
 * portrait is pulled to the right so the eyes follow the cursor.
 */
const EXPRESSIONS = {
  neutral: "smiling",
  surprised: "surprised",
  startled: "startled",
  skeptical: "skeptical",
  playful: "winking with his tongue out",
  wink: "winking",
  puppy: "giving puppy eyes",
} as const;
type Expression = keyof typeof EXPRESSIONS;
type Face = { name: Expression; mirrored: boolean };
const REST: Face = { name: "neutral", mirrored: false };
const expressionSrc = (name: Expression) => `/images/hero/expressions/${name}.webp`;

const RING = { cx: 1259, rx: 356, ry: 83 };
const RING_REST_CY = [709, 757, 797]; // top → bottom

/* ---- Animation tuning ---- */
const START_OFFSET = 360; // rings start this far below their resting spot
const PEAK_OFFSET = -620; // how far above rest the top ring travels (past the head)
const RISE = { duration: 1.4, ease: [0.33, 0, 0.2, 1] as const };
const STAGGER = 0.09; // seconds between rings
const SETTLE = { type: "spring", stiffness: 70, damping: 13, mass: 1 } as const;

/*
 * Idle movement after the rings settle. Each ring layers a bob (px), a tilt
 * (deg) and a squash (scaleY, reads as the ring tipping toward/away from you).
 * Durations are deliberately uneven so the combined motion never lines up.
 */
const IDLE = [
  { bob: 12, bobDur: 3.8, tilt: 2.5, tiltDur: 6.4, squash: 0.14, squashDur: 5.0 },
  { bob: 9, bobDur: 4.6, tilt: -2, tiltDur: 7.3, squash: 0.1, squashDur: 5.9 },
  { bob: 14, bobDur: 4.1, tilt: 3, tiltDur: 5.6, squash: 0.16, squashDur: 4.4 },
];
const IDLE_FADE_IN = 1.2; // seconds to ease from rest into the idle loop

/*
 * Slingshot. Distances are in viewBox units. The portrait follows the pointer
 * on a rubber band that stiffens towards PULL.max; the rings trail behind it.
 * On release an underdamped spring sends it past its resting spot and back.
 */
const PULL = {
  max: 240, // the band never stretches further than this
  tilt: 0.04, // degrees of tilt per unit pulled sideways
  look: 70, // pulled further than this, the face reacts to the direction
  tug: 50, // released before this, it was just a poke
  hard: 170, // released after this, he lands on puppy eyes instead of a wink
  ringFollow: [0.6, 0.45, 0.3], // how much of the pull each ring takes
};
const FLING = { type: "spring", stiffness: 320, damping: 10 } as const;
const RING_FLING = [
  { type: "spring", stiffness: 260, damping: 8 },
  { type: "spring", stiffness: 220, damping: 7 },
  { type: "spring", stiffness: 180, damping: 6 },
] as const;
const FLIGHT_MS = 650; // tongue out while flying
const LANDED_MS = 2000; // landing face holds this long before the smile returns
const KEY_PULL = 160; // how far Enter/Space pulls before letting go

// Speech blob next to the head. Rides along with the portrait when it's pulled.
const BLOB = { x: 1330, y: 90, padding: 36, height: 68, tilt: -6 };
const BLOB_TEXT = {
  rest: "Don't pull me!",
  pulled: "ok... now let me go",
  released: "Phew, thanks!",
};
const BLOB_CHAR = 14.15; // width of one Anonymous Pro bold character at fontSize 26
const blobWidth = (text: string) => text.length * BLOB_CHAR + BLOB.padding * 2;
const BLOB_DELAY = INTRO.rings + 2; // pops in once the rings have settled
const BLOB_POP = { type: "spring", stiffness: 380, damping: 14 } as const;

// Exponential rubber band: 1:1 near rest, flattening out at PULL.max
const band = (v: number) => Math.sign(v) * PULL.max * (1 - Math.exp(-Math.abs(v) / PULL.max));

function faceForPull(x: number, y: number): Face {
  if (Math.hypot(x, y) < PULL.look) return { name: "surprised", mirrored: false };
  return { name: Math.abs(x) > Math.abs(y) ? "skeptical" : "startled", mirrored: x > 0 };
}

// Lower half of an ellipse, drawn right → left through the bottom
const frontArc = (cy: number) =>
  `M${RING.cx + RING.rx} ${cy}A${RING.rx} ${RING.ry} 0 0 1 ${RING.cx - RING.rx} ${cy}`;

export function PortraitRings({ className }: { className?: string }) {
  const id = useId();
  const clipId = `${id}-shape`;
  const maskId = `${id}-reveal`;
  const reduceMotion = useReducedMotion();
  const ready = useIntroReady();

  const rings = [useRingMotion(), useRingMotion(), useRingMotion()];
  const opacity = useMotionValue(0);

  // Edge of the revealed area (y of the lead ring's centre). Only ever moves
  // up, so the portrait stays visible when the rings drop back down.
  const revealCy = useMotionValue(RING_REST_CY[0] + START_OFFSET);

  const [face, setFace] = useState<Face>(REST);
  const [dragging, setDragging] = useState(false);
  const [blob, setBlob] = useState<keyof typeof BLOB_TEXT>("rest");
  const pullX = useMotionValue(0);
  const pullY = useMotionValue(0);
  const tilt = useTransform(pullX, (x) => x * PULL.tilt);
  const blobScale = useMotionValue(0);
  const drag = useRef<{ x: number; y: number; scale: number; peak: number } | null>(null);
  const flings = useRef<{ stop: () => void }[]>([]);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (reduceMotion) {
      rings.forEach((ring) => ring.y.set(0));
      opacity.set(1);
      revealCy.set(-1000);
      blobScale.set(1);
      return;
    }
    if (!ready) return; // wait for the loader

    const unsubscribe = rings[0].y.on("change", (offset) => {
      const cy = RING_REST_CY[0] + offset;
      if (cy < revealCy.get()) revealCy.set(cy);
    });

    const controls: { stop: () => void }[] = [];
    let cancelled = false;

    controls.push(animate(opacity, 1, { duration: 0.4, delay: INTRO.rings }));
    controls.push(animate(blobScale, 1, { ...BLOB_POP, delay: BLOB_DELAY }));

    rings.forEach((ring, i) => {
      const rise = animate(ring.y, PEAK_OFFSET, { ...RISE, delay: INTRO.rings + i * STAGGER });
      controls.push(rise);
      rise.then(() => {
        if (cancelled) return;
        const settle = animate(ring.y, 0, SETTLE);
        controls.push(settle);
        settle.then(() => {
          if (!cancelled) controls.push(...startIdle(ring, IDLE[i]));
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
  }, [reduceMotion, ready]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      flings.current.forEach((c) => c.stop());
    },
    [],
  );

  const show = (next: Face) =>
    setFace((prev) => (prev.name === next.name && prev.mirrored === next.mirrored ? prev : next));

  const later = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const stopAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    flings.current.forEach((c) => c.stop());
    flings.current = [];
  };

  const setPull = (x: number, y: number) => {
    if (reduceMotion) return; // faces still change, nothing moves
    pullX.set(x);
    pullY.set(y);
    rings.forEach((ring, i) => {
      ring.pullX.set(x * PULL.ringFollow[i]);
      ring.pullY.set(y * PULL.ringFollow[i]);
    });
  };

  const fling = (peak: number) => {
    stopAll();
    if (!reduceMotion) {
      flings.current = [
        animate(pullX, 0, FLING),
        animate(pullY, 0, FLING),
        ...rings.flatMap((ring, i) => [
          animate(ring.pullX, 0, RING_FLING[i]),
          animate(ring.pullY, 0, RING_FLING[i]),
        ]),
      ];
    }
    if (peak < PULL.tug) {
      setBlob("rest");
      show({ name: "wink", mirrored: false });
      later(LANDED_MS, () => show(REST));
      return;
    }
    setBlob("released");
    show({ name: "playful", mirrored: false });
    later(FLIGHT_MS, () => show({ name: peak > PULL.hard ? "puppy" : "wink", mirrored: false }));
    later(FLIGHT_MS + LANDED_MS, () => {
      show(REST);
      setBlob("rest");
    });
  };

  const grab = (e: React.PointerEvent<SVGGElement>) => {
    if (!ready || e.button !== 0) return;
    const svg = e.currentTarget.ownerSVGElement;
    if (!svg) return;
    stopAll();
    e.currentTarget.setPointerCapture(e.pointerId);
    const scale = VIEWBOX.width / svg.getBoundingClientRect().width;
    // Grabbing mid-flight picks it up from where it is
    drag.current = {
      x: e.clientX - pullX.get() / scale,
      y: e.clientY - pullY.get() / scale,
      scale,
      peak: 0,
    };
    setDragging(true);
    setBlob("pulled");
    show({ name: "surprised", mirrored: false });
  };

  const pull = (e: React.PointerEvent<SVGGElement>) => {
    const d = drag.current;
    if (!d) return;
    const x = band((e.clientX - d.x) * d.scale);
    const y = band((e.clientY - d.y) * d.scale);
    d.peak = Math.max(d.peak, Math.hypot(x, y));
    setPull(x, y);
    show(faceForPull(x, y));
  };

  const release = () => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    setDragging(false);
    fling(d.peak);
  };

  const blobText = BLOB_TEXT[blob];

  const pullWithKeyboard =(e: React.KeyboardEvent<SVGGElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    if (!ready || drag.current) return;
    stopAll();
    if (reduceMotion) return fling(KEY_PULL);
    show({ name: "startled", mirrored: false });
    const windUp = animate(0, KEY_PULL, {
      duration: 0.35,
      ease: "easeOut",
      onUpdate: (y) => setPull(0, y),
    });
    flings.current = [windUp];
    windUp.then(() => fling(KEY_PULL));
  };

  return (
    <svg
      viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.width} ${VIEWBOX.height}`}
      overflow="visible"
      // Phones keep vertical scrolling over the portrait; they can still tug it sideways or tap it
      className={`touch-none select-none pointer-coarse:touch-pan-y ${className ?? ""}`}
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
          <RingGroup key={i} ring={ring} cy={RING_REST_CY[i]}>
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

      {/* Portrait — grab it, pull, let go */}
      <motion.g
        role="button"
        tabIndex={0}
        aria-label={`Portrait of Vlad Todirut, ${EXPRESSIONS[face.name]}. Pull it and let go.`}
        onPointerDown={grab}
        onPointerMove={pull}
        onPointerUp={release}
        onPointerCancel={release}
        onKeyDown={pullWithKeyboard}
        className={`outline-none ${ready ? (dragging ? "cursor-grabbing" : "cursor-grab") : ""}`}
        style={{
          x: pullX,
          y: pullY,
          rotate: tilt,
          ...origin(RING.cx, PORTRAIT.shapeY),
        }}
      >
        <g clipPath={`url(#${clipId})`}>
          <g mask={`url(#${maskId})`}>
            {/* Only the resting face loads up front; the rest come in once the intro starts */}
            {(Object.keys(EXPRESSIONS) as Expression[])
              .filter((name) => ready || name === REST.name)
              .map((name) => (
                <image
                  key={name}
                  href={expressionSrc(name)}
                  x={PORTRAIT.x}
                  y={PORTRAIT.y}
                  width={PORTRAIT.width}
                  height={PORTRAIT.height}
                  preserveAspectRatio="xMidYMid slice"
                  visibility={name === face.name ? "visible" : "hidden"}
                  transform={
                    name === face.name && face.mirrored
                      ? `translate(${2 * PORTRAIT.x + PORTRAIT.width} 0) scale(-1 1)`
                      : undefined
                  }
                />
              ))}
          </g>
        </g>

        <motion.g
          aria-hidden
          style={{
            scale: blobScale,
            rotate: BLOB.tilt,
            // Grows out of the tail, like he's saying it
            ...origin(BLOB.x + 14, BLOB.y + BLOB.height + 34),
          }}
        >
          <rect
            x={BLOB.x}
            y={BLOB.y}
            width={blobWidth(blobText)}
            height={BLOB.height}
            rx={BLOB.height / 2}
            fill="var(--color-accent-lime)"
          />
          {/* Tail pointing down-left at the head */}
          <path
            d={`M${BLOB.x + 30} ${BLOB.y + BLOB.height - 6}L${BLOB.x + 70} ${BLOB.y + BLOB.height - 2}L${BLOB.x + 14} ${BLOB.y + BLOB.height + 34}Z`}
            fill="var(--color-accent-lime)"
          />
          <text
            x={BLOB.x + blobWidth(blobText) / 2}
            y={BLOB.y + BLOB.height / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={26}
            fontWeight={700}
            fill="var(--color-bg)"
            className="font-mono"
          >
            {blobText}
          </text>
        </motion.g>
      </motion.g>

      {/* Front arcs — over the portrait */}
      <motion.g style={{ opacity }} pointerEvents="none">
        {rings.map((ring, i) => (
          <RingGroup key={i} ring={ring} cy={RING_REST_CY[i]}>
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

type RingMotion = {
  y: MotionValue<number>;
  rotate: MotionValue<number>;
  scaleY: MotionValue<number>;
  // Offset from the slingshot, kept apart from the intro/idle movement
  pullX: MotionValue<number>;
  pullY: MotionValue<number>;
};

function useRingMotion(): RingMotion {
  return {
    y: useMotionValue(START_OFFSET),
    rotate: useMotionValue(0),
    scaleY: useMotionValue(1),
    pullX: useMotionValue(0),
    pullY: useMotionValue(0),
  };
}

// Loops out from the resting value and back, so there's no jump at the start
function startIdle(ring: RingMotion, idle: (typeof IDLE)[number]) {
  const loop = (duration: number) => ({
    duration,
    ease: "easeInOut" as const,
    repeat: Infinity,
  });
  return [
    animate(ring.y, [0, -idle.bob, 0, idle.bob * 0.4, 0], loop(idle.bobDur)),
    animate(ring.rotate, [0, idle.tilt, 0, -idle.tilt, 0], {
      ...loop(idle.tiltDur),
      delay: IDLE_FADE_IN * 0.3,
    }),
    animate(ring.scaleY, [1, 1 - idle.squash, 1, 1 + idle.squash * 0.6, 1], {
      ...loop(idle.squashDur),
      delay: IDLE_FADE_IN * 0.6,
    }),
  ];
}

// Back ellipse and front arc share one transform origin (the ring's centre),
// otherwise tilt/squash would pivot them around different bounding boxes.
function RingGroup({
  ring,
  cy,
  children,
}: {
  ring: RingMotion;
  cy: number;
  children: React.ReactNode;
}) {
  const y = useTransform(() => ring.y.get() + ring.pullY.get());
  return (
    <motion.g
      style={{
        x: ring.pullX,
        y,
        rotate: ring.rotate,
        scaleY: ring.scaleY,
        transformBox: "view-box",
        transformOrigin: `${RING.cx}px ${cy}px`,
      }}
    >
      {children}
    </motion.g>
  );
}
