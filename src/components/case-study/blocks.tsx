import Image, { type StaticImageData } from "next/image";

/*
 * Building blocks for case study MDX files. Registered globally in
 * src/mdx-components.tsx, so MDX can use them without importing.
 */

/* Small mono label above a section title, e.g. "TASK #1" */
export function SectionTitle({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <div className="mt-48 flex flex-col gap-12 first:mt-0">
      <span className="text-label font-mono uppercase text-fg-mono">{eyebrow}</span>
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
          <dt className="text-label font-mono uppercase text-fg-mono">{label}</dt>
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
  return (
    <div className="my-24 flex flex-col gap-8">
      <span className="text-label font-mono uppercase text-fg-mono">{eyebrow}</span>
      <span className="text-display font-medium text-accent-blue">{value}</span>
      <span className="text-body-lg font-light text-fg-muted">{label}</span>
    </div>
  );
}

/* Image with optional caption; `narrow` keeps it at text width */
export function Figure({
  src,
  alt,
  caption,
  narrow = false,
}: {
  src: StaticImageData;
  alt: string;
  caption?: string;
  narrow?: boolean;
}) {
  return (
    <figure className={`my-24 flex flex-col gap-12 ${narrow ? "mx-auto w-full max-w-[760px]" : ""}`}>
      <Image
        src={src}
        alt={alt}
        placeholder="blur"
        sizes={narrow ? "(min-width: 800px) 760px, 100vw" : "(min-width: 1200px) 1100px, 100vw"}
        className="h-auto w-full rounded-lg"
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
