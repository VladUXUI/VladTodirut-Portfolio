"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { motion, useReducedMotion } from "motion/react";
import selfie from "@/content/about/future-product-days.jpg";
import cat from "@/content/about/cat.jpg";
import furniture from "@/content/about/furniture.jpg";

type Photo = {
  id: string;
  caption: string;
  /** Tilt once it lands, in degrees */
  rotate: number;
  /** Position and width inside the collage, mobile first */
  className: string;
} & (
  | { image: StaticImageData; alt: string }
  | { video: { src: string; poster: string; width: number; height: number }; label: string }
);

const photos: Photo[] = [
  {
    id: "dogs",
    video: { src: "/videos/about/dogs.mp4", poster: "/videos/about/dogs-poster.jpg", width: 360, height: 640 },
    label: "Our two Lagotto Romagnolos running around a forest clearing in autumn",
    caption: "Daily forest patrol",
    rotate: -6,
    className: "left-[3%] top-[38%] w-[38%] sm:left-[2%] sm:top-[8%] sm:w-[17%]",
  },
  {
    id: "fpd",
    image: selfie,
    alt: "Selfie of Vlad in front of a Future Product Days sign",
    caption: "Future Product Days",
    rotate: 2,
    className: "left-[2%] top-[1%] w-[82%] sm:left-[20%] sm:top-[16%] sm:w-[36%]",
  },
  {
    id: "cat",
    image: cat,
    alt: "Our ginger cat sitting on a mossy branch, looking at the camera",
    caption: "The cat, supervising",
    rotate: 5,
    className: "left-[52%] top-[33%] w-[44%] sm:left-[77%] sm:top-[10%] sm:w-[20%]",
  },
  {
    id: "furniture",
    image: furniture,
    alt: "A yellow chest of drawers with wavy, fluted drawer fronts and wooden knobs",
    caption: "A chest of drawers I built",
    rotate: -3,
    className: "left-[50%] top-[67%] w-[44%] sm:left-[54%] sm:top-[4%] sm:w-[20%]",
  },
];

/*
 * Photos scattered at the top of About, in white photo frames. They can be
 * dragged around like prints on a table; the one you grab comes to the front.
 */
export function AboutPhotos() {
  const area = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Stacking order, last id on top
  const [order, setOrder] = useState(photos.map((p) => p.id));

  return (
    <div ref={area} className="relative my-24 aspect-[9/20] w-full sm:aspect-[1100/520]">
      {photos.map((photo, i) => (
        <motion.figure
          key={photo.id}
          drag
          dragConstraints={area}
          dragElastic={0.15}
          dragMomentum={false}
          onPointerDown={() => setOrder((o) => [...o.filter((id) => id !== photo.id), photo.id])}
          initial={reduce ? false : { opacity: 0, y: 40, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: photo.rotate }}
          transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          whileHover={reduce ? undefined : { scale: 1.03 }}
          whileDrag={{ scale: 1.06, cursor: "grabbing" }}
          style={{ zIndex: order.indexOf(photo.id) + 1 }}
          className={`absolute flex cursor-grab touch-none flex-col gap-8 rounded-[16px] bg-[#f4f1ec] p-8 pb-12 shadow-[0_12px_32px_rgb(0_0_0/0.45)] select-none sm:rounded-lg sm:p-12 sm:pb-16 ${photo.className}`}
        >
          {"image" in photo ? (
            <Image
              src={photo.image}
              alt={photo.alt}
              placeholder="blur"
              draggable={false}
              sizes="(min-width: 640px) 440px, 80vw"
              className="pointer-events-none h-auto w-full rounded-sm sm:rounded-md"
            />
          ) : (
            <FrameVideo {...photo.video} label={photo.label} />
          )}
          <figcaption className="font-mono text-[13px] leading-tight text-[#2a2430] sm:text-[15px]">
            {photo.caption}
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}

/* Silent loop that only plays while on screen; stays on the poster with reduced motion */
function FrameVideo({
  src,
  poster,
  width,
  height,
  label,
}: {
  src: string;
  poster: string;
  width: number;
  height: number;
  label: string;
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
      className="pointer-events-none h-auto w-full rounded-sm sm:rounded-md"
    />
  );
}
