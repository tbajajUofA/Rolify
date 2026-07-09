"use client";

import { signIn } from "next-auth/react";

export function LoginButton() {
  return (
    <button
      type="button"
      onClick={() => signIn("spotify", { callbackUrl: "/galaxy" })}
      className="spotify-focus-ring group relative inline-flex min-h-16 items-center gap-4 overflow-hidden border border-omnitrix-green/80 bg-omnitrix-green px-8 py-5 font-mono text-sm font-black uppercase tracking-[0.22em] text-black shadow-omnitrix-glow transition hover:-translate-y-1 hover:brightness-110"
    >
      <span className="absolute inset-0 animate-omnitrixPulse bg-omnitrix-green/10" />
      <span className="relative font-display text-lg">◷</span>
      <span className="relative">link spotify</span>
    </button>
  );
}
