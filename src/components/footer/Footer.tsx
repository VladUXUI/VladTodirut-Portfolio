import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { BackToTop } from "./BackToTop";
import { CopyEmail } from "./CopyEmail";

export function Footer() {
  const links = [...site.profiles, { label: "Resume", href: site.resume }];

  return (
    <footer id="contact" className="relative mt-160 border-t border-dot">
      <div className="bg-dots pointer-events-none absolute inset-0 -z-10" aria-hidden />

      <Container className="flex flex-col gap-96 pt-128 pb-48 lg:pt-160">
        <div className="flex flex-col gap-64">
          <h2 className="flex flex-col">
            <span className="text-title-2xl font-medium">Got a product challenge?</span>
            <span className="text-title-2xl font-mono text-outline">Let&apos;s talk.</span>
          </h2>

          <CopyEmail email={site.email} />

          <ul className="flex flex-wrap gap-x-48 gap-y-16">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-8 text-cta tracking-tag text-fg transition-colors duration-150 hover:text-accent-lime focus-visible:text-accent-lime focus-visible:outline-none"
                >
                  {link.label}
                  <ArrowUpRight />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-16 border-t border-dot pt-24">
          <p className="text-body text-fg-dim">
            {site.name} © {new Date().getFullYear()}
          </p>
          <BackToTop />
        </div>
      </Container>
    </footer>
  );
}

function ArrowUpRight() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}
