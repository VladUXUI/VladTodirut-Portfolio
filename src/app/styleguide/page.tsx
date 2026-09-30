import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false },
};

const colors = [
  ["bg", "bg-bg"],
  ["surface", "bg-surface"],
  ["fg", "bg-fg"],
  ["fg-muted", "bg-fg-muted"],
  ["fg-subtle", "bg-fg-subtle"],
  ["fg-mono", "bg-fg-mono"],
  ["dot", "bg-dot"],
  ["tick", "bg-tick"],
  ["border-soft", "bg-border-soft"],
  ["accent-blue", "bg-accent-blue"],
  ["accent-green", "bg-accent-green"],
  ["accent-lime", "bg-accent-lime"],
] as const;

const spacing = [
  ["0", "w-0"],
  ["2", "w-2"],
  ["4", "w-4"],
  ["8", "w-8"],
  ["12", "w-12"],
  ["16", "w-16"],
  ["24", "w-24"],
  ["32", "w-32"],
  ["40", "w-40"],
  ["48", "w-48"],
  ["56", "w-56"],
  ["64", "w-64"],
  ["72", "w-72"],
  ["80", "w-80"],
  ["96", "w-96"],
  ["112", "w-112"],
  ["128", "w-128"],
  ["160", "w-160"],
  ["192", "w-192"],
  ["256", "w-256"],
] as const;

const type = [
  ["display", "text-display font-medium", "Vlad"],
  ["display / mono outline", "text-display font-mono text-outline", "Todirut"],
  ["title-xl", "text-title-xl font-medium text-accent-blue", "Echoes"],
  ["title-lg", "text-title-lg font-medium", "Selected Works"],
  ["lead", "text-lead font-light text-fg-muted", "Turning complex fintech problems"],
  ["title-md", "text-title-md font-medium", "Design"],
  ["body-lg", "text-body-lg font-light text-fg-subtle", "Design systems"],
  ["label", "text-label font-mono text-fg-mono", "Since 2010"],
  ["body", "text-body", "Home · Work · About · Contact"],
] as const;

const radii = [
  ["sm", "rounded-sm"],
  ["md", "rounded-md"],
  ["lg", "rounded-lg"],
  ["xl", "rounded-xl"],
  ["full", "rounded-full"],
] as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-24 border-t border-tick pt-32">
      <h2 className="text-label font-mono text-fg-mono">{title}</h2>
      {children}
    </section>
  );
}

export default function Styleguide() {
  return (
    <main className="bg-dots flex flex-col gap-64 px-64 py-96">
      <h1 className="text-title-lg font-medium">Styleguide</h1>

      <Section title="Color">
        <div className="grid grid-cols-2 gap-16 sm:grid-cols-4 lg:grid-cols-6">
          {colors.map(([name, cls]) => (
            <div key={name} className="flex flex-col gap-8">
              <div className={`${cls} h-80 rounded-md border border-tick`} />
              <span className="text-body text-fg-subtle">{name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Spacing — 8px grid">
        <div className="flex flex-col gap-8">
          {spacing.map(([name, cls]) => (
            <div key={name} className="flex items-center gap-16">
              <span className="w-48 text-body font-mono text-fg-mono">{name}</span>
              <div className={`${cls} h-12 bg-accent-blue`} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <div className="flex flex-col gap-24">
          {type.map(([name, cls, sample]) => (
            <div key={name} className="flex flex-col gap-4">
              <span className="text-body font-mono text-fg-mono">{name}</span>
              <span className={cls}>{sample}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Radius">
        <div className="flex flex-wrap gap-24">
          {radii.map(([name, cls]) => (
            <div key={name} className="flex flex-col items-center gap-8">
              <div className={`${cls} size-96 border border-border-soft`} />
              <span className="text-body text-fg-subtle">{name}</span>
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}
