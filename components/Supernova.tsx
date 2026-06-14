import type { Artist } from "@/lib/types";
import { SectionReveal } from "@/components/SectionReveal";

export function Supernova({ artist }: { artist?: Artist }) {
  return (
    <SectionReveal
      eyebrow="04 / supernova"
      title="the fastest rising signal"
      description="The biggest short-term rank jump detonates into a bright burst before settling into a new star."
    >
      <div className="panel relative grid min-h-[520px] place-items-center overflow-hidden p-8 text-center">
        <div className="absolute h-96 w-96 rounded-full bg-spotify-green/20 blur-3xl" />
        <div className="absolute h-64 w-64 animate-ping rounded-full border border-spotify-neon/60" />
        <div className="absolute h-40 w-40 rounded-full bg-galaxy-cyan shadow-[0_0_100px_rgba(0,229,255,0.72)]" />
        <div className="relative z-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-spotify-neon">
            burst source
          </p>
          <h3 className="mt-5 text-5xl font-black text-white sm:text-7xl">
            {artist?.name ?? "unknown artist"}
          </h3>
          <p className="mx-auto mt-6 max-w-xl text-white/62">
            {(artist?.genres ?? []).slice(0, 4).join(" / ") || "new remnant locked in orbit"}
          </p>
        </div>
      </div>
    </SectionReveal>
  );
}
