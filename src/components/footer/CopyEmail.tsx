"use client";

import { useEffect, useState } from "react";

/* Big email that copies on click; falls back to mailto if the clipboard is blocked */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <div className="flex flex-col items-start gap-8">
      <button
        type="button"
        onClick={copy}
        className="group flex cursor-pointer items-center gap-16 text-left text-lead font-light break-all text-fg transition-colors duration-150 hover:text-accent-lime focus-visible:text-accent-lime focus-visible:outline-none"
      >
        {email}
        <CopyIcon />
      </button>
      <span className="text-label font-mono text-fg-mono" aria-live="polite">
        {copied ? "Copied to clipboard" : "Click to copy"}
      </span>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden className="shrink-0">
      <rect x="8" y="8" width="13" height="13" rx="2" />
      <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
    </svg>
  );
}
