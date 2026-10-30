export type Project = {
  slug: string;
  title: string;
  tags: string;
  description: string;
  /** Card image (752 × 766 ratio). Null shows a placeholder card. */
  image: string | null;
  /** Looping video cover, shown instead of the image */
  video?: {
    src: string;
    poster: string;
    /** CSS object-position for the crop */
    position?: string;
    /** "contain" shows the whole video, letterboxed on black */
    fit?: "cover" | "contain";
    /** Hide the card's sides, e.g. to mask parts of a recording */
    crop?: { left: string; right: string };
  };
  /** Animated layer drawn over the card image */
  overlay?: "pip" | "taho-signing" | "mezo-layers";
  /** Card button label; defaults to "View case study" */
  cta?: string;
  /** Leave the card out of the site until its page is ready */
  hidden?: boolean;
};

// TODO: real descriptions + images for every project
const PLACEHOLDER_DESCRIPTION =
  "Some text here about the project, my role and the main things I did for it. It can span about two or three lines of text, but it should be something catching for each.";

const allProductProjects: Project[] = [
  {
    slug: "skouta",
    title: "Skouta",
    tags: "Co-Founder / Civic Alerts / MobileApp",
    description:
      "Official Swedish safety alerts, in English, in one calm feed. I co-founded it, designed it and built the whole thing with AI. Live on iOS and Android, and a finalist for the UX Nordics award.",
    image: "/images/work/skouta.png",
    overlay: "pip",
  },
  {
    slug: "taho",
    title: "Taho",
    tags: "Fintech / Wallet / Browser extension",
    description:
      "Signing a crypto transaction used to mean approving a wall of code. I was Taho's only product designer, and I made it readable. Rejected transactions dropped 23%, support tickets 35%.",
    image: "/images/work/taho.webp",
    overlay: "taho-signing",
  },
  {
    slug: "mezo",
    title: "Mezo",
    tags: "Fintech / Crypto / WebApp",
    description:
      "A Bitcoin points program with a lot of rules and very careful users. I reworked how deposits, referrals and points are shown, and the 'how does this work?' questions dropped.",
    image: "/images/work/Mezo/background.png",
    overlay: "mezo-layers",
  },
  {
    slug: "subscape",
    title: "Subscape",
    tags: "Web3 game / Governance / WebApp",
    description:
      "We turned community voting into a map-based strategy game. I designed the product, the brand and Scout, the guide. 60,000 people joined during the six-week beta.",
    image: "/images/work/subscape.png",
    video: {
      src: "/videos/case-studies/subscape/realms-map.mp4",
      poster: "/videos/case-studies/subscape/realms-map-poster.jpg",
      // Crops out Scout's welcome box on the right instead of cutting it in half
      position: "37% center",
    },
  },
  {
    slug: "echoes",
    title: "Echoes",
    tags: "Product Design / MobileApp / Music",
    description:
      "A music app where listening proves you're a real fan. I designed the pitch prototype for the client, from personas that change with your taste to the clay look.",
    image: "/images/work/echoes.png",
    video: {
      src: "/videos/work/echoes.mp4",
      poster: "/videos/work/echoes-poster.jpg",
      fit: "contain",
      // Hides the screen recording's touch indicator, parked right of the phone
      crop: { left: "21%", right: "20%" },
    },
  },
];

// TODO: replace with the real AI / design system projects
const allAiProjects: Project[] = [
  {
    slug: "design-system",
    title: "Design Systems",
    tags: "Taho / Mezo / Peanut / TokenFoundry",
    description:
      "How I build design systems these days, and what Taho, Mezo and Peanut taught me along the way (including how 12 button variants became 4).",
    image: "/images/DS_work.png",
    cta: "Explore",
  },
  {
    slug: "working-with-ai",
    title: "Working with AI",
    tags: "Research / Design / Build & ship",
    description:
      "How I use AI from market research all the way to the App Store, and where I don't let it decide. Mostly told through Skouta.",
    image: "/images/AI_work.png",
    cta: "Explore",
  },
  {
    slug: "ai-workflows",
    title: "AI Workflows",
    tags: "Agents / Skills / Automation",
    description: PLACEHOLDER_DESCRIPTION,
    image: null,
    cta: "Explore",
    hidden: true, // not enough material for its own page
  },
];

export const productProjects = allProductProjects.filter((p) => !p.hidden);
export const aiProjects = allAiProjects.filter((p) => !p.hidden);
