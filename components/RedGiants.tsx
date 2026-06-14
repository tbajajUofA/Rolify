import type { Track } from "@/lib/types";
import { SectionReveal } from "@/components/SectionReveal";

export function RedGiants({ artists }: { artists: Track["artists"] }) {
  return (
    <SectionReveal
      eyebrow="03 / red giants"
      title="fading favorites still burn"
      description="Long-term artists missing from your short-term orbit expand into dim red giant stars."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {artists.map((artist, index) => (
          <div key={artist.id} className="panel relative min-h-56 overflow-hidden p-6">
            <div
              className="absolute right-6 top-6 animate-redGiant rounded-full bg-galaxy-orange shadow-[0_0_80px_rgba(216,90,48,0.68)]"
              style={{ width: 86 + index * 8, height: 86 + index * 8 }}
            />
            <p className="readout relative z-10">red giant {String(index + 1).padStart(2, "0")}</p>
            <h3 className="relative z-10 mt-14 text-3xl font-black text-white">{artist.name}</h3>
            <p className="relative z-10 mt-4 text-sm text-white/56">
              {artist.genres.slice(0, 3).join(" / ") || "archived starlight"}
            </p>
          </div>
        ))}
      </div>
    </SectionReveal>
  );
}
