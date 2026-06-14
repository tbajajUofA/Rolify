"use client";

import { signIn } from "next-auth/react";

export function LoginButton() {
  return (
    <button
      type="button"
      onClick={() => signIn("spotify", { callbackUrl: "/galaxy" })}
      className="spotify-focus-ring group relative inline-flex min-h-16 items-center gap-4 overflow-hidden border border-spotify-neon/80 bg-spotify-green px-8 py-5 font-mono text-sm font-black uppercase tracking-[0.22em] text-black shadow-spotify-glow transition hover:-translate-y-1 hover:bg-spotify-neon"
    >
      <span className="absolute inset-0 animate-pulseSwitch bg-spotify-neon/10" />
      <span className="relative h-4 w-4 rounded-full bg-black shadow-[0_0_18px_rgba(0,0,0,0.8)] transition group-hover:translate-x-1" />
      <span className="relative">connect spotify</span>
    </button>
  );
}
