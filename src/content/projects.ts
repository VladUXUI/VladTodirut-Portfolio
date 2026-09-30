export type Project = {
  slug: string;
  title: string;
  tags: string;
  description: string;
  /** Card image (752 × 766 ratio). Null shows a placeholder card. */
  image: string | null;
};

// TODO: real descriptions + images for every project
const PLACEHOLDER_DESCRIPTION =
  "Some text here about the project, my role and the main things I did for it. It can span about two or three lines of text, but it should be something catching for each.";

export const productProjects: Project[] = [
  {
    slug: "mezo",
    title: "Mezo",
    tags: "Fintech / Crypto / WebApp",
    description: PLACEHOLDER_DESCRIPTION,
    image: "/images/work/mezo.png",
  },
  {
    slug: "skouta",
    title: "Skouta",
    tags: "Co-Founder / Civic Alerts / MobileApp",
    description: PLACEHOLDER_DESCRIPTION,
    image: null,
  },
  {
    slug: "taho",
    title: "Taho",
    tags: "Fintech / Wallet / Browser extension",
    description: PLACEHOLDER_DESCRIPTION,
    image: "/images/work/taho.png",
  },
  {
    slug: "echoes",
    title: "Echoes",
    tags: "Product Design / MobileApp / Music",
    description: PLACEHOLDER_DESCRIPTION,
    image: "/images/work/echoes.png",
  },
  {
    slug: "subscape",
    title: "Subscape",
    tags: "Web3 game / Governance / WebApp",
    description: PLACEHOLDER_DESCRIPTION,
    image: "/images/work/subscape.png",
  },
];

// TODO: replace with the real AI / design system projects
export const aiProjects: Project[] = [
  {
    slug: "design-system",
    title: "Design System",
    tags: "Tokens / Components / Documentation",
    description: PLACEHOLDER_DESCRIPTION,
    image: null,
  },
  {
    slug: "ai-prototyping",
    title: "AI Prototyping",
    tags: "Vibe coding / Prototypes / Validation",
    description: PLACEHOLDER_DESCRIPTION,
    image: null,
  },
  {
    slug: "ai-workflows",
    title: "AI Workflows",
    tags: "Agents / Skills / Automation",
    description: PLACEHOLDER_DESCRIPTION,
    image: null,
  },
];
