import type { GenreCount } from "@/lib/types";
import { SectionReveal } from "@/components/SectionReveal";

export function GravityWell({ genres }: { genres: GenreCount[] }) {
  const core = genres[0];
  const showEventHorizon = (core?.percentage ?? 0) >= 40;

  return (
    <SectionReveal
      eyebrow="02 / gravity well"
      title="one genre bends the orbit"
      description="Your most repeated genre becomes the central gravity field pulling smaller genre bodies toward it."
    >
      <div className="panel relative min-h-[560px] overflow-hidden p-6">
        <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black shadow-[0_0_100px_rgba(29,185,84,0.5),inset_0_0_80px_rgba(0,0,0,1)] ring-2 ring-spotify-green/40" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-spotify-green/20" />
        {showEventHorizon ? (
          <div className="absolute left-1/2 top-[calc(50%+10rem)] -translate-x-1/2 font-mono text-xs uppercase tracking-[0.24em] text-spotify-neon">
            event horizon detected
          </div>
        ) : null}
        <div className="absolute left-1/2 top-1/2 z-10 w-52 -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-spotify-neon">
            {core?.percentage ?? 0}%
          </p>
          <h3 className="mt-2 text-3xl font-black text-white">{core?.genre ?? "unknown signal"}</h3>
        </div>
        {genres.slice(1, 11).map((genre, index) => {
          const angle = (index / Math.max(genres.length - 1, 1)) * Math.PI * 2;
          const radius = 175 + index * 16;
          const left = `calc(50% + ${Math.cos(angle) * radius}px)`;
          const top = `calc(50% + ${Math.sin(angle) * radius}px)`;

          return (
            <div
              key={genre.genre}
              className="absolute rounded-full bg-spotify-neon shadow-spotify-glow"
              style={{
                left,
                top,
                width: 12 + genre.count * 3,
                height: 12 + genre.count * 3,
                transform: "translate(-50%, -50%)",
                opacity: 0.62 + genre.percentage / 100
              }}
              title={genre.genre}
            />
          );
        })}
      </div>
    </SectionReveal>
  );
}
