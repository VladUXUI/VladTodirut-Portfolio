"use client";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="cursor-pointer text-body text-fg-dim transition-colors duration-150 hover:text-accent-lime focus-visible:text-accent-lime focus-visible:outline-none"
    >
      Back to top ↑
    </button>
  );
}
