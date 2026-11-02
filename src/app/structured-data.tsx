import { site } from "@/content/site";

/*
 * schema.org data for search engines and AI assistants. The Person and
 * WebSite sit in the root layout; pages point back at them by @id.
 */
export const personId = `${site.url}/#person`;
const websiteId = `${site.url}/#website`;

const abs = (path: string) => new URL(path, site.url).toString();

export const siteGraph = [
  {
    "@type": "Person",
    "@id": personId,
    name: site.name,
    url: site.url,
    image: abs("/images/hero/expressions/neutral.webp"),
    jobTitle: site.jobTitle,
    description:
      "Senior product designer with 15 years of experience on complex products, mostly fintech and crypto: MetaMask's first UX pass, the Taho wallet, Mezo. Also builds the products, with AI. Based in Gothenburg, Sweden. Open to remote senior or lead roles, and to freelance projects.",
    email: `mailto:${site.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location.city,
      addressCountry: site.location.countryCode,
    },
    nationality: { "@type": "Country", name: "Romania" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Arts and Design University, Timișoara" },
    knowsAbout: [
      "Product design",
      "0 to 1 product design",
      "Founding designer",
      "MVP design and launch",
      "Early-stage startups",
      "UX design",
      "Design systems",
      "Design tokens",
      "Fintech product design",
      "Crypto and web3 product design",
      "Wallet UX",
      "Transaction signing UX",
      "AI-assisted product development",
      "Information architecture",
    ],
    sameAs: site.profiles.map((p) => p.href),
    subjectOf: { "@type": "DigitalDocument", name: `${site.name} CV`, url: abs(site.cv), encodingFormat: "application/pdf" },
  },
  {
    "@type": "Organization",
    "@id": "https://skouta.app/#organization",
    name: "Skouta",
    url: "https://skouta.app",
    description: "Official Swedish public safety alerts, translated into English, in one feed.",
    founder: { "@id": personId },
  },
  {
    "@type": "WebSite",
    "@id": websiteId,
    url: site.url,
    name: site.name,
    inLanguage: "en",
    author: { "@id": personId },
  },
];

export function aboutGraph() {
  return [
    {
      "@type": "ProfilePage",
      url: abs("/about"),
      name: `About ${site.name}`,
      isPartOf: { "@id": websiteId },
      mainEntity: { "@id": personId },
    },
  ];
}

export function caseStudyGraph({
  slug,
  title,
  description,
  image,
}: {
  slug: string;
  title: string;
  description: string;
  image?: string;
}) {
  const url = abs(`/work/${slug}`);
  return [
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: title,
      description,
      url,
      mainEntityOfPage: url,
      ...(image && { image: abs(image) }),
      author: { "@id": personId },
      isPartOf: { "@id": websiteId },
      inLanguage: "en",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Work", item: abs("/#work") },
        { "@type": "ListItem", position: 3, name: title, item: url },
      ],
    },
  ];
}

export function JsonLd({ graph }: { graph: object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c"),
      }}
    />
  );
}
