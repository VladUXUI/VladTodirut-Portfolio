"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

const ITEMS = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

const GLIDE = { type: "spring", stiffness: 420, damping: 34 } as const;

export function MainMenu() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);

  const active =
    ITEMS.find((item) =>
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
    )?.href ?? null;
  const marked = hovered ?? active;

  return (
    <nav aria-label="Main">
      <ul
        className="flex items-center gap-40 sm:gap-56"
        onMouseLeave={() => setHovered(null)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setHovered(null);
        }}
      >
        {ITEMS.map((item) => {
          const isActive = item.href === active;
          const isMarked = item.href === marked;
          return (
            <li key={item.href} className="relative">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                onMouseEnter={() => setHovered(item.href)}
                onFocus={() => setHovered(item.href)}
                className={`relative block text-body transition-opacity duration-200 focus-visible:outline-none ${
                  isMarked ? "opacity-100" : "opacity-70"
                }`}
              >
                {item.label}
                {isMarked && (
                  <motion.span
                    layoutId="main-menu-brackets"
                    transition={reduceMotion ? { duration: 0 } : GLIDE}
                    className="pointer-events-none absolute -inset-x-24 inset-y-0 flex justify-between"
                    aria-hidden
                  >
                    <Bracket />
                    <Bracket className="-scale-x-100" />
                  </motion.span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* Figma "Rectangle 1": 12 × 21 open bracket, 1px stroke */
function Bracket({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12.5 22"
      preserveAspectRatio="none"
      className={`h-full w-12 text-fg-muted ${className}`}
    >
      <path d="M12.5 0.5L0.5 0.5V21.5H12.5" fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
