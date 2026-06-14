"use client";

export function StarfieldBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(29,185,84,0.24),transparent_24rem),radial-gradient(circle_at_72%_8%,rgba(0,229,255,0.22),transparent_28rem),radial-gradient(circle_at_55%_62%,rgba(212,83,126,0.15),transparent_32rem),#000]" />
      <div className="absolute inset-[-120px] animate-driftStars opacity-70 [background-image:radial-gradient(circle,rgba(255,255,255,0.82)_1px,transparent_1px),radial-gradient(circle,rgba(30,215,96,0.72)_1px,transparent_1px),radial-gradient(circle,rgba(0,229,255,0.62)_1px,transparent_1px)] [background-position:0_0,48px_76px,92px_18px] [background-size:120px_120px,170px_170px,220px_220px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.08),rgba(0,0,0,0.78))]" />
    </div>
  );
}
