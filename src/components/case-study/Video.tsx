"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/*
 * Silent looping clip (UI recordings). Plays only while on screen; with
 * reduced motion it stays on the poster frame.
 */
export function Video({
  src,
  poster,
  width,
  height,
  label,
  narrow = false,
  className = "rounded-lg",
}: {
  src: string;
  poster: string;
  width: number;
  height: number;
  /** Describes what the clip shows, for screen readers */
  label: string;
  /** Keep at text width (760px) instead of the full column */
  narrow?: boolean;
  /** Extra classes for the video, e.g. a larger radius for heroes */
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video || reduce) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduce]);

  return (
    <figure className={narrow ? "my-24 w-full max-w-[760px]" : "my-24"}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        width={width}
        height={height}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        className={`h-auto w-full ${className}`}
      />
    </figure>
  );
}
