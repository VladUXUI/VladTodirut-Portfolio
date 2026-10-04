import Image, { type StaticImageData } from "next/image";

/*
 * Building blocks for case study MDX files. Registered globally in
 * src/mdx-components.tsx, so MDX can use them without importing.
 */

/* Small mono label above a section title, e.g. "TASK #1" */
export function SectionTitle({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <div className="mt-48 flex flex-col gap-12 first:mt-0">
      <span className="text-label font-mono uppercase text-accent-lime">{eyebrow}</span>
      <h2 className="text-title-md font-medium">{children}</h2>
    </div>
  );
}

/* Role / goals / needs row */
export function Meta({ items }: { items: { label: string; value: string | string[] }[] }) {
  return (
    <dl className="my-24 grid gap-40 border-y border-dot py-40 md:grid-cols-3">
      {items.map(({ label, value }) => (
        <div key={label} className="flex flex-col gap-12">
          <dt className="text-label font-mono uppercase text-fg">{label}</dt>
          {(Array.isArray(value) ? value : [value]).map((line) => (
            <dd key={line} className="text-prose font-light">
              {line}
            </dd>
          ))}
        </div>
      ))}
    </dl>
  );
}

/* Headline number, e.g. $150M */
export function Stat({ eyebrow, value, label }: { eyebrow: string; value: string; label: string }) {
  return <Stats eyebrow={eyebrow} items={[{ value, label }]} />;
}

/* Several headline numbers side by side, e.g. -23% / -10s */
export function Stats({
  eyebrow,
  items,
}: {
  eyebrow: string;
  items: { value: string; label: string }[];
}) {
  return (
    <div className="my-24 flex flex-col gap-8">
      <span className="text-label font-mono uppercase text-accent-lime">{eyebrow}</span>
      <div className="flex flex-wrap gap-x-96 gap-y-24">
        {items.map(({ value, label }) => (
          <div key={label} className="flex flex-col gap-8">
            <span className="text-display font-medium">{value}</span>
            <span className="text-body-lg font-light text-fg-muted">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/*
 * Image with optional caption. Size: full column (default), `narrow` (text
 * width) or `small` (inline illustrations, GIFs).
 * `rounded={false}` for transparent images whose content reaches the edges.
 */
export function Figure({
  src,
  alt,
  caption,
  narrow = false,
  small = false,
  rounded = true,
}: {
  src: StaticImageData;
  alt: string;
  caption?: string;
  narrow?: boolean;
  small?: boolean;
  rounded?: boolean;
}) {
  const width = small ? "w-full max-w-[420px]" : narrow ? "mx-auto w-full max-w-[760px]" : "";
  return (
    <figure className={`my-24 flex flex-col gap-12 ${width}`}>
      <Image
        src={src}
        alt={alt}
        placeholder={src.blurDataURL ? "blur" : "empty"}
        sizes={
          small ? "420px" : narrow ? "(min-width: 800px) 760px, 100vw" : "(min-width: 1200px) 1100px, 100vw"
        }
        className={`h-auto w-full ${rounded ? "rounded-lg" : ""}`}
      />
      {caption && <figcaption className="text-body text-fg-dim">{caption}</figcaption>}
    </figure>
  );
}

/* Titled step inside a section, e.g. "Exploration #1" */
export function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-24 flex flex-col gap-12">
      <h4 className="text-body-lg font-medium text-fg">{title}</h4>
      <div className="flex flex-col gap-16">{children}</div>
    </div>
  );
}
