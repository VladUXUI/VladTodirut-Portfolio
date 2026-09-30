import Image from "next/image";
import { PortraitRings } from "./PortraitRings";

export function Hero() {
  return (
    <section className="relative mx-auto grid w-full max-w-[1728px] items-center gap-48 px-24 pt-128 pb-64 lg:min-h-[1000px] lg:grid-cols-[1fr_minmax(0,720px)] lg:px-160 lg:pt-0">
      <div className="bg-dots pointer-events-none absolute inset-24 -z-10" aria-hidden />

      <div className="flex flex-col gap-40">
        <h1 className="flex flex-col">
          <span className="text-display font-medium">Vlad</span>
          <span className="text-display font-mono text-outline">Todirut</span>
        </h1>

        <div className="flex flex-col gap-4 pl-8">
          <p className="max-w-[556px] text-lead font-light text-fg-muted">
            Turning complex fintech problems into easy flows.
          </p>
          <p className="flex flex-col items-start gap-4 text-label font-mono text-fg-mono">
            Since 2010
            <Image src="/images/hero/squiggle.svg" alt="" width={123} height={11} />
          </p>
        </div>
      </div>

      <PortraitRings className="mx-auto w-full max-w-[720px]" />
    </section>
  );
}
