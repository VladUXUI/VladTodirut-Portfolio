import type { MDXComponents } from "mdx/types";
import { BeforeAfter } from "@/components/case-study/BeforeAfter";
import { Figure, Meta, SectionTitle, Stat, Step } from "@/components/case-study/blocks";

/* Styles for markdown in case studies, plus the blocks MDX can use directly */
const components: MDXComponents = {
  h2: (props) => <h2 className="mt-48 text-title-md font-medium" {...props} />,
  h3: (props) => <h3 className="mt-24 text-body-lg font-light text-accent-blue-soft" {...props} />,
  p: (props) => <p className="max-w-[760px] text-prose font-light text-fg-muted" {...props} />,
  ul: (props) => (
    <ul
      className="flex max-w-[760px] list-disc flex-col gap-8 pl-24 text-prose font-light text-fg-muted marker:text-accent-blue-soft"
      {...props}
    />
  ),
  strong: (props) => <strong className="font-medium text-fg" {...props} />,
  a: (props) => (
    <a className="text-fg underline underline-offset-4 hover:text-accent-lime" {...props} />
  ),
  // `---` separates the big sections
  hr: () => <hr className="my-72 border-dot" />,
  SectionTitle,
  Meta,
  Stat,
  Figure,
  BeforeAfter,
  Step,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
