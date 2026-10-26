import { CharReveal, Squiggle, Typewriter, WordReveal } from "./IntroText";
import { INTRO } from "@/components/intro/timeline";
import { Container } from "@/components/ui/Container";
import { PortraitRings } from "./PortraitRings";

export function Hero() {
  return (
    <Container
      as="section"
      className="relative grid items-center gap-48 pt-128 pb-64 lg:min-h-[1000px] lg:grid-cols-[1fr_minmax(0,720px)] lg:pt-0"
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
            text="Senior product designer. I've spent 15 years making complicated products easier to understand, mostly ones where a wrong click costs real money."
            delay={INTRO.tagline}
            stagger={0.03}
            className="max-w-[556px] text-lead font-light text-fg-muted"
          />
          <WordReveal
            text="These days I also build what I design, with a lot of help from AI."
            delay={INTRO.subtitle}
            stagger={0.02}
            className="mt-16 max-w-[556px] text-body-lg font-light text-fg-dim"
          />
          <p className="flex flex-col items-start gap-4 text-label font-mono text-fg-mono">
            <Typewriter text="Since 2010" delay={INTRO.since} charDuration={0.05} />
            <Squiggle delay={INTRO.squiggle} />
          </p>
        </div>
      </div>

      <PortraitRings className="mx-auto w-full max-w-[720px] lg:mr-0" />
    </Container>
  );
}
