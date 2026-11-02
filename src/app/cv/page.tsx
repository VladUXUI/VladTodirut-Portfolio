import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { cv, type Job } from "@/content/cv";
import { site } from "@/content/site";
import { pageMetadata } from "@/app/shared-metadata";

export const metadata: Metadata = pageMetadata({
  title: `${site.name} — ${cv.title} CV`,
  description: cv.summary[0],
  path: "/cv",
});

const linkedIn = site.profiles.find((p) => p.label === "LinkedIn")!.href;
// Written out in full so the addresses survive printing and ATS parsing
const contacts = [
  { label: site.url.replace("https://", ""), href: site.url },
  { label: linkedIn.replace(/^https:\/\/www\.|\/$/g, ""), href: linkedIn },
  { label: site.email, href: `mailto:${site.email}` },
];

/*
 * One column, real text, standard section names: the page prints to the
 * PDF recruiters download, and ATS tools read it top to bottom.
 */
export default function CvPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Container as="section" className="pt-160 lg:pt-192 print:max-w-none print:p-0">
        <article className="mx-auto flex max-w-[1100px] flex-col gap-64 print:gap-16 print:text-black">
          <header className="flex flex-col gap-24 print:gap-8">
            <div className="flex flex-wrap items-baseline justify-between gap-24">
              <h1 className="flex flex-wrap items-baseline gap-x-24 gap-y-8 print:gap-x-12">
                <span className="text-title-xl font-medium print:text-[22pt] print:font-bold">{site.name}</span>
                <span className="text-lead font-light text-fg-muted print:text-[16pt] print:text-black/60">
                  {cv.title}
                </span>
              </h1>
              <a
                href={site.cv}
                download
                className="inline-flex items-center gap-8 text-cta tracking-tag text-fg transition-colors duration-150 hover:text-accent-lime focus-visible:text-accent-lime focus-visible:outline-none print:hidden"
              >
                Download PDF
                <ArrowDown />
              </a>
            </div>
            <ul className="flex flex-wrap gap-x-32 gap-y-8 text-body-lg text-fg-muted print:gap-x-24 print:text-[10pt] print:text-black/70">
              {contacts.map((c) => (
                <li key={c.href}>
                  <a href={c.href} className="underline-offset-4 hover:text-accent-lime hover:underline">
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-body-lg text-fg-muted print:text-[10pt] print:text-black/70">
              {cv.availability.join(" · ")}
            </p>
          </header>

          <Section title="Summary">
            {cv.summary.map((p) => (
              <p key={p} className="text-body-lg font-light print:text-[10.5pt] print:font-normal">
                {nb(p)}
              </p>
            ))}
          </Section>

          <Section title="Experience">
            <div className="flex flex-col gap-56 print:gap-16">
              {cv.experience.map((job) => (
                <JobEntry key={job.company} job={job} />
              ))}
            </div>
          </Section>

          <Section title="Skills">
            <p className="text-body-lg font-light print:text-[10.5pt] print:font-normal">{cv.skills.join(", ")}</p>
          </Section>

          <Section title="Tools">
            <p className="text-body-lg font-light print:text-[10.5pt] print:font-normal">{nb(cv.tools.join(", "))}</p>
          </Section>

          <Section title="Education">
            <p className="text-body-lg font-light print:text-[10.5pt] print:font-normal">
              <strong className="font-medium print:font-bold">{cv.education.degree}</strong>,{" "}
              {cv.education.school}, {cv.education.year}
            </p>
          </Section>

          <Section title="Languages">
            <p className="text-body-lg font-light print:text-[10.5pt] print:font-normal">{cv.languages.join(", ")}</p>
          </Section>
        </article>
      </Container>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-24 border-t border-dot pt-32 print:gap-8 print:border-black/15 print:pt-8">
      <h2 className="text-label font-mono uppercase text-accent-lime print:font-sans print:text-[9pt] print:font-bold print:tracking-wide print:text-black">
        {title}
      </h2>
      {children}
    </section>
  );
}

function JobEntry({ job }: { job: Job }) {
  const body = "text-body-lg font-light text-fg-muted print:text-[10pt] print:font-normal print:text-black/75";
  return (
    <div className="flex flex-col gap-16 print:break-inside-avoid print:gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-24 gap-y-4">
        <h3 className="text-title-md font-medium print:text-[12.5pt] print:font-bold">
          {job.company} – {job.role}
        </h3>
        <p className="text-label font-mono text-fg-mono print:font-sans print:text-[10pt] print:text-black/60">
          {job.dates}
        </p>
      </div>
      {job.intro && <p className="text-body-lg font-light print:text-[10.5pt] print:font-normal">{nb(job.intro)}</p>}
      {job.projects?.map((p) => (
        <div key={p.name} className="flex flex-col gap-4 pl-24 print:gap-0 print:pl-16">
          <h4 className="text-body-lg font-medium print:text-[10.5pt] print:font-bold">{p.name}</h4>
          <p className={body}>{nb(p.text)}</p>
        </div>
      ))}
      {job.bullets && (
        <ul className={`flex list-disc flex-col gap-8 pl-24 marker:text-fg-mono print:gap-2 print:pl-16 ${body}`}>
          {job.bullets.map((b) => (
            <li key={b}>{nb(b)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ArrowDown() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  );
}

/*
 * Keeps hyphenated words on one line. A hyphen at a line break gets dropped
 * by PDF text extraction, so "AI-assisted" would reach ATS as "AIassisted".
 */
function nb(text: string) {
  return text.split(/(\S*\w-\w\S*)/).map((part, i) =>
    i % 2 ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
