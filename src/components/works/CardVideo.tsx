"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";

/*
 * Looping card cover. Plays only while its card is showing: `active` from the
 * desktop showcase, otherwise while on screen. Reduced motion keeps the poster.
 */
export function CardVideo({
  src,
  poster,
  position = "center",
  fit = "cover",
  crop,
  active,
}: {
  src: string;
  poster: string;
  position?: string;
  fit?: "cover" | "contain";
  /** Hide the card's sides (CSS inset values), e.g. to mask parts of a recording */
  crop?: { left: string; right: string };
  active?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.25 });
  const play = !reduce && (active ?? inView);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (play) {
      // Only fetch the video once the card has been shown
      if (!video.getAttribute("src")) video.src = src;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [play, src]);

  return (
    <div className={`absolute inset-0 overflow-clip rounded-xl ${fit === "contain" ? "bg-black" : ""}`}>
      <video
        ref={ref}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
        className={`size-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
        style={{
          objectPosition: position,
          clipPath: crop && `inset(0 ${crop.right} 0 ${crop.left})`,
        }}
      />
    </div>
  );
}
