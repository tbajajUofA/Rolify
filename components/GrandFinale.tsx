import Image from "next/image";
import type { VisualTrack } from "@/lib/types";

export function GrandFinale({ track }: { track?: VisualTrack }) {
  return (
    <section className="section-shell grid min-h-screen place-items-center">
      <div className="section-inner grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative aspect-square overflow-hidden border border-spotify-green/40 bg-spotify-green/10 shadow-spotify-glow">
          {track?.albumArt ? (
            <Image src={track.albumArt} alt="" fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-spotify-neon">NO SIGNAL</div>
          )}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(0,0,0,0.34))]" />
        </div>
        <div>
          <p className="eyebrow">12 / grand finale</p>
          <h2 className="mt-4 text-5xl font-black leading-none text-white sm:text-7xl">
            major discovery confirmed
          </h2>
          <p className="mt-7 font-mono text-sm uppercase tracking-[0.24em] text-spotify-neon">
            long-term core track
          </p>
          <h3 className="mt-4 text-4xl font-black text-white sm:text-6xl">
            {track?.name ?? "No track signal"}
          </h3>
          <p className="mt-5 text-xl text-white/68">
            {track?.artists.map((artist) => artist.name).join(", ") ?? "Connect Spotify to scan again"}
          </p>
          {track?.externalUrl ? (
            <a
              href={track.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="spotify-focus-ring mt-9 inline-flex border border-spotify-neon bg-spotify-green px-7 py-4 font-mono text-xs font-black uppercase tracking-[0.22em] text-black shadow-spotify-glow transition hover:-translate-y-1 hover:bg-spotify-neon"
            >
              play again on spotify
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
