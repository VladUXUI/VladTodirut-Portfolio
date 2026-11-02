/*
 * CV content for /cv and the downloadable PDF (pnpm cv:pdf).
 * Plain text only, so recruiter tools (ATS) read it the same way people do.
 */
export type Job = {
  company: string;
  role: string;
  dates: string;
  intro?: string;
  projects?: { name: string; text: string }[];
  bullets?: string[];
};

export const cv = {
  title: "Senior Product Designer",
  // Location, which screening tools look for
  availability: ["Gothenburg, Sweden", "Open to remote"],
  summary: [
    "Senior Product Designer with 15 years of experience on complex, trust-critical products in fintech and crypto, from MetaMask's first full UX/UI pass to Bitcoin finance at Mezo.",
    "Founding designer on Taho and Skouta, taking both from first concept to launch. Builds design systems from tokens to code, and designs and ships products end to end with AI (Claude Code, Cursor).",
  ],
  experience: [
    {
      company: "Skouta",
      role: "Co-founder & Product Designer",
      dates: "2026 – Present",
      intro:
        "Co-founded Skouta, a mobile app that brings official Swedish public safety alerts into one feed, translated into English, with a map, push notifications and a daily digest. Live on iOS and Android.",
      bullets: [
        "Owned product design, the design system and the visual brand, from first concept to App Store and Google Play launch in about 5 months",
        "Built the full product end to end with AI-assisted development (Claude Code, Cursor): Expo app, Supabase backend, 9 official API integrations in SQL, cron jobs for the daily digest and notification filtering, DeepL translation, push notifications and paywall",
        "Top 3 finalist for the UX Nordics award at Future Product Days",
      ],
    },
    {
      company: "Independent",
      role: "Senior Product Designer",
      dates: "2025 – Present",
      intro:
        "Freelance product design for early-stage startups in fintech and crypto, with a focus on design systems and AI-assisted product development.",
      projects: [
        {
          name: "Peanut",
          text: "Sole designer on a fintech app with a crypto component. Took over a design system that had drifted, audited it with AI and rebuilt the components and documentation in Figma: button variants from 12 to 4, input designs from 6 to 1 and card versions from 24 to one system, all passing WCAG AA.",
        },
        {
          name: "Thrive Protocol",
          text: "Designed and shipped a data-heavy platform for evaluating proposals and allocating treasury funds to builders, working directly with the founders. Built entirely with AI-assisted development (Lovable).",
        },
        {
          name: "TokenFoundry (Personal Project)",
          text: "A Figma plugin and preview website that turn design tokens into production-ready React + Tailwind design systems.",
        },
      ],
    },
    {
      company: "Mezo (Thesis)",
      role: "Design Lead",
      dates: "2024 – 2025",
      intro:
        "Design Lead at Mezo, a Bitcoin Layer 2 for BTC holders, during a points campaign that reached $150M in Total Value Locked.",
      bullets: [
        "First and only designer on the Points Portal, owning it end to end and defining its core user flows and interaction patterns",
        "Led design for the economy part of the Testnet and Mainnet DeFi experiences, alongside designers who owned other parts of the system",
        "Designed trust-critical BTC deposit flows and made the difference between points and tokens clear, to reduce confusion in a high-risk financial product",
      ],
    },
    {
      company: "Taho (Thesis)",
      role: "Lead Product & Brand Designer",
      dates: "2021 – 2024",
      intro:
        "Founding and sole product designer on Taho, a browser-extension crypto wallet, from first concept to a live product with 150,000 active users.",
      bullets: [
        "Owned the browser extension, web experience, design system and brand",
        "Redesigned transaction signing: cut average signing time by 10 seconds, rejected transactions by 23% and support tickets by 35%",
        "Worked with the founders and Head of Product on what to build next, taking on de-facto product responsibilities including feature prioritisation",
        "Built and evolved the design system, so the team could ship faster with consistent UX across surfaces",
        "Prioritised UX improvements based on user feedback, analytics and security considerations",
      ],
    },
    {
      company: "ConsenSys",
      role: "Product & Brand Designer",
      dates: "2015 – 2020",
      intro:
        "Joined as the company's 2nd product designer and helped launch over 30 blockchain products, about 10 of them as lead designer.",
      bullets: [
        "Delivered the first full UX/UI pass for MetaMask, shaping its foundational user experience",
        "Co-founded Ujo Music, guiding UX priorities and product decisions",
        "Helped set early UX patterns and design standards across teams",
      ],
    },
    {
      company: "Freelance & Agency",
      role: "UX/UI and Brand Designer",
      dates: "2009 – 2015",
      bullets: [
        "Designed websites, web applications and digital experiences for global clients across consumer and B2B domains",
        "Worked with brands including IKEA, Heineken, McDonald's and Desperados",
      ],
    },
  ] satisfies Job[],
  skills: [
    "0 to 1 Product Design",
    "Design Systems & Design Tokens",
    "Interaction Design",
    "Prototyping",
    "User Research & Usability Testing",
    "Information Architecture",
    "Accessibility (WCAG)",
    "AI-Assisted Product Development",
    "Fintech & Crypto UX",
  ],
  tools: [
    "Figma",
    "FigJam",
    "Framer",
    "Claude Code",
    "Cursor",
    "VS Code",
    "Lovable",
    "Expo",
    "Supabase",
    "GitHub",
    "Linear",
    "Jira",
    "Maze",
    "UserTesting",
  ],
  education: {
    degree: "MA Visual Arts",
    school: "Arts and Design University, Timisoara",
    year: "2010",
  },
  languages: ["English (fluent)", "Romanian (native)", "Hungarian (fluent)", "Swedish (learning)"],
};
