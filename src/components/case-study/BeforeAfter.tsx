"use client";

import { useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";

/*
 * Drag (or use arrow keys on) the handle to compare two images.
 * "After" is clipped from the left, revealing "before" underneath.
 */
export function BeforeAfter({
  before,
  after,
  alt,
  start = 50,
}: {
  before: StaticImageData;
  after: StaticImageData;
  alt: string;
  start?: number;
}) {
  const [position, setPosition] = useState(start);
  const frameRef = useRef<HTMLDivElement>(null);

  const moveTo = (clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  };

  return (
    <figure className="my-24">
      <div
        ref={frameRef}
        className="relative cursor-ew-resize touch-pan-y overflow-hidden rounded-lg select-none"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          moveTo(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) moveTo(e.clientX);
        }}
      >
        <Image
          src={before}
          alt={`${alt}, before`}
          placeholder="blur"
          sizes="(min-width: 1200px) 1100px, 100vw"
          className="h-auto w-full"
          draggable={false}
        />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
          <Image
            src={after}
            alt={`${alt}, after`}
            sizes="(min-width: 1200px) 1100px, 100vw"
            className="h-auto w-full"
            draggable={false}
          />
        </div>

        <span className="absolute top-16 left-16 rounded-sm bg-bg/80 px-12 py-4 text-body">Before</span>
        <span className="absolute top-16 right-16 rounded-sm bg-bg/80 px-12 py-4 text-body">After</span>

        {/* Handle doubles as an accessible slider */}
        <div className="absolute inset-y-0 w-2 -translate-x-1/2 bg-fg" style={{ left: `${position}%` }}>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(position)}
            onChange={(e) => setPosition(Number(e.target.value))}
            aria-label="Compare before and after"
            className="peer pointer-events-none absolute inset-0 size-full opacity-0"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 flex size-48 -translate-1/2 items-center justify-center rounded-full bg-fg text-bg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-accent-lime"
          >
            ‹ ›
          </span>
        </div>
      </div>
    </figure>
  );
}
