"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "./intro";

const INSTANT = { duration: 0 };

/* Letters slide up from behind a mask, one after another */
export function CharReveal({
  text,
  delay,
  stagger = 0.06,
  className = "",
}: {
  text: string;
  delay: number;
  stagger?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <span className={`inline-flex ${className}`}>
      <span className="sr-only">{text}</span>
      {[...text].map((char, i) => (
        // Padding gives ascenders/descenders room inside the mask
        <span key={i} className="-my-[0.12em] inline-block overflow-hidden py-[0.12em]" aria-hidden>
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={reduce ? INSTANT : { delay: delay + i * stagger, duration: 0.8, ease: EASE_OUT }}
          >
            {char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* Words slide up and fade in, one after another */
export function WordReveal({
  text,
  delay,
  stagger = 0.05,
  className = "",
}: {
  text: string;
  delay: number;
  stagger?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <span key={i} aria-hidden>
          <span className="-mb-[0.15em] inline-block overflow-hidden pb-[0.15em] align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={reduce ? INSTANT : { delay: delay + i * stagger, duration: 0.7, ease: EASE_OUT }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

/*
 * Types text out character by character with a caret. Relies on a monospace
 * font: the clip steps by exactly one character width per tick.
 */
export function Typewriter({
  text,
  delay,
  charDuration = 0.07,
  className = "",
  caretClassName = "bg-current",
}: {
  text: string;
  delay: number;
  charDuration?: number;
  className?: string;
  caretClassName?: string;
}) {
  const reduce = useReducedMotion();
  const n = text.length;
  const typing = n * charDuration;
  const blink = 1.2;
  const total = typing + blink;
  const step = (t: number) => Math.floor(t * n) / n;

  return (
    <span className={`relative inline-block ${className}`}>
      <motion.span
        className="inline-block"
        initial={{ clipPath: "inset(-20% 100% -20% -5%)" }}
        animate={{ clipPath: "inset(-20% 0% -20% -5%)" }}
        transition={reduce ? INSTANT : { delay, duration: typing, ease: step }}
      >
        {text}
      </motion.span>
      {!reduce && (
        <motion.span
          aria-hidden
          className={`absolute top-[12%] h-[76%] w-[0.08em] ${caretClassName}`}
          initial={{ left: "0%", opacity: 0 }}
          animate={{ left: "100%", opacity: [0, 1, 1, 0, 1, 0, 1, 0] }}
          transition={{
            left: { delay, duration: typing, ease: step },
            opacity: {
              delay,
              duration: total,
              ease: "linear",
              times: [
                0,
                0.01,
                typing / total,
                (typing + 0.2) / total,
                (typing + 0.45) / total,
                (typing + 0.65) / total,
                (typing + 0.9) / total,
                1,
              ],
            },
          }}
        />
      )}
    </span>
  );
}

/* Figma "Group 3" squiggle as one continuous path, drawn left → right */
const SQUIGGLE_PATH =
  "M1.5 5.5" +
  Array.from({ length: 15 }, (_, k) => `A4 4 0 0 ${k % 2} ${1.5 + 8 * (k + 1)} 5.5`).join("");

export function Squiggle({ delay }: { delay: number }) {
  const reduce = useReducedMotion();
  return (
    <svg width={123} height={11} viewBox="0 0 123 11" fill="none" aria-hidden className="overflow-visible">
      <motion.path
        d={SQUIGGLE_PATH}
        stroke="var(--color-accent-blue)"
        strokeWidth={3}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={reduce ? INSTANT : { delay, duration: 0.6, ease: "easeInOut" }}
      />
    </svg>
  );
}
