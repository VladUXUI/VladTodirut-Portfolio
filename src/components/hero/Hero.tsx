import { CharReveal, Typewriter, WordReveal } from "./IntroText";
import { INTRO } from "@/components/intro/timeline";
import { Container } from "@/components/ui/Container";
import { PortraitRings } from "./PortraitRings";

export function Hero() {
  return (
    <Container
      as="section"
      className="relative grid items-center gap-48 pt-128 pb-64 lg:min-h-[1000px] lg:grid-cols-[1fr_minmax(0,504px)] lg:pt-0"
    >
      <div className="bg-dots pointer-events-none absolute inset-24 -z-10" aria-hidden />

      <div className="flex flex-col gap-40">
        <h1 className="flex flex-col">
          <CharReveal text="Vlad" delay={INTRO.name} className="text-display font-medium" />
          <Typewriter
            text="Todirut"
            delay={INTRO.surname}
            className="self-start text-display font-mono text-outline"
            caretClassName="bg-accent-green"
          />
        </h1>

        <div className="flex flex-col gap-4 pl-8">
          <WordReveal
            text="Product Designer / Builder."
            delay={INTRO.tagline}
            className="text-lead font-light text-fg-muted"
          />
          <WordReveal
            text="15 years in and I still wake up thinking about users and business problems (yes, before coffee). Solving them is still the fun part, and AI lets me do way more of it, way faster."
            delay={INTRO.subtitle}
            stagger={0.03}
            className="mt-8 text-body-lg font-light text-fg-dim"
          />
        </div>
      </div>

      <PortraitRings className="mx-auto w-full max-w-[504px] lg:mr-0" />
    </Container>
  );
}
