"use client";

import { Fragment } from "react";
import { MotionConfig, motion } from "motion/react";
import { skillGroups, skillsIntro } from "@/content/skills";
import { Container } from "@/components/ui/Container";
import { EASE_OUT } from "@/components/intro/timeline";
import { SectionHeading } from "@/components/works/SectionHeading";

/* Rows fade up one after another as each group scrolls into view */
const reveal = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -10% 0px" },
  transition: { duration: 0.6, delay: i * 0.06, ease: EASE_OUT },
});

export function SkillSets() {
  return (
    <MotionConfig reducedMotion="user">
      <Container as="section" id="skills" className="pt-96 pb-128 lg:pt-128">
        <SectionHeading barClass="bg-accent-green">Skill sets</SectionHeading>

        <div className="mt-64 grid gap-64 lg:grid-cols-[minmax(0,428px)_minmax(0,968px)] lg:justify-between">
          {/* Intro stays put while the groups scroll past (desktop) */}
          <div className="flex flex-col gap-40 self-start lg:sticky lg:top-96 lg:gap-72">
            <span className="h-px w-full max-w-[412px] bg-fg-subtle" aria-hidden />
            <p className="text-body-lg font-light">{skillsIntro}</p>
            <span className="h-px w-full max-w-[412px] bg-fg-subtle" aria-hidden />
          </div>

          <div className="flex flex-col gap-48">
            {skillGroups.map((group, g) => (
              <Fragment key={group.title}>
                {g > 0 && <div className="divider-dashed" aria-hidden />}
                <div className="grid gap-24 md:grid-cols-[minmax(160px,1fr)_minmax(0,720px)]">
                  <h3 className="text-title-md font-medium">{group.title}</h3>
                  <ul className="flex flex-col gap-24">
                    {group.skills.map((skill, i) => (
                      <motion.li
                        key={skill}
                        {...reveal(i)}
                        className="border-b border-fg-subtle pb-24 text-body-lg font-light text-fg-subtle"
                      >
                        {skill}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </Container>
    </MotionConfig>
  );
}
