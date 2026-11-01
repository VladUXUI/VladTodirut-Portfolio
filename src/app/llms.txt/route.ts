import { after } from "next/server";
import { aiProjects, productProjects } from "@/content/projects";
import { hasCaseStudy } from "@/content/case-studies";
import { site } from "@/content/site";
import { flushPosthogLogs, logLlmsTxtGenerated, logLlmsTxtRequested } from "@/lib/posthog-logs";

/*
 * /llms.txt: a plain markdown summary of the site for AI assistants
 * (https://llmstxt.org). Built from the same content as the pages.
 */
export function GET() {
  logLlmsTxtRequested();

  // Card descriptions, since they carry the results
  const section = (projects: typeof productProjects) =>
    projects
      .filter((p) => hasCaseStudy(p.slug))
      .map((p) => `- [${p.title}](${site.url}/work/${p.slug}): ${p.description}`)
      .join("\n");

  const body = `# ${site.name}

> ${site.jobTitle} with 15 years of experience on complex products, mostly fintech and crypto, where a wrong click costs real money. Based in ${site.location.city}, ${site.location.country}. Open to senior or lead product design roles, preferably remote, and to freelance projects.

Vlad did the first full UX/UI pass on MetaMask at ConsenSys (2015–2020), was the only product designer at the Taho wallet (2021–2024, ~150,000 active users), and led design at Mezo, a Bitcoin Layer 2, during a points campaign that reached $150M in deposits (2024–2025). Since 2025 Vlad has worked independently with early-stage startups, and co-founded Skouta, a civic alerts app for Sweden, designed and built end to end with AI (a UX Nordics award finalist at Future Product Days). Strengths: taking products from 0 to 1 (founding designer on Taho and Skouta, from first concept to launch), product design for trust-critical products, design systems, and designing and building with AI (Claude Code, Cursor).

## Case studies

${section(productProjects)}

## Design systems and AI

${section(aiProjects)}

## About and contact

- [About](${site.url}/about): background, way of working, and the kind of role Vlad is looking for
- [CV (PDF)](${site.url}${site.cv})
- Email: ${site.email}
${site.profiles.map((p) => `- ${p.label}: ${p.href}`).join("\n")}
- Skouta: https://skouta.app
`;

  logLlmsTxtGenerated();
  after(flushPosthogLogs);

  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
