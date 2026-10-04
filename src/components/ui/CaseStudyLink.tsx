"use client";

import { useId } from "react";
import Link from "next/link";

/*
 * Figma "BT_case": Default → hover (lime) → pressed (lime, hatch fills in).
 * Keyboard focus uses the hover look.
 */
export function CaseStudyLink({
  href,
  label = "View case study",
  external = false,
}: {
  href: string;
  label?: string;
  /** Opens in a new tab (prototypes, live products) */
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className="group inline-flex items-center gap-4 text-cta tracking-tag whitespace-nowrap text-fg transition-colors duration-150 hover:text-accent-lime focus-visible:text-accent-lime focus-visible:outline-none active:text-accent-lime"
    >
      {label}
      <PlayIcon />
    </Link>
  );
}

function PlayIcon() {
  const maskId = useId();
  const hatch =
    "transition-[stroke-width] duration-150 [stroke-width:1px] group-active:[stroke-width:5px]";
  return (
    <svg width={26} height={26} viewBox="0 0 26 26" fill="none" aria-hidden className="shrink-0">
      <mask id={maskId} style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="6" y="3" width="18" height="20">
        <path
          d="M23 11.268C24.3333 12.0378 24.3333 13.9623 23 14.7321L9.5 22.5263C8.16667 23.2961 6.5 22.3338 6.5 20.7942L6.5 5.20577C6.5 3.66617 8.16667 2.70392 9.5 3.47372L23 11.268Z"
          fill="#fff"
        />
      </mask>
      <g mask={`url(#${maskId})`} stroke="currentColor">
        <path d="M22.75 11.7012C23.7499 12.2785 23.7499 13.7215 22.75 14.2988L9.25 22.0937C8.25003 22.6709 7 21.9486 7 20.7939L7 5.20605C7 4.05143 8.25003 3.32912 9.25 3.90625L22.75 11.7012Z" />
        <line className={hatch} x1="-4.874" y1="9.567" x2="19.374" y2="23.567" />
        <line className={hatch} x1="-2.874" y1="6.103" x2="21.374" y2="20.103" />
        <line className={hatch} x1="-0.874" y1="2.639" x2="23.374" y2="16.639" />
      </g>
    </svg>
  );
}
