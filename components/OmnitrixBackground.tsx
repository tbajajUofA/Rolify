export function OmnitrixBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <div
        className="absolute left-1/2 top-1/2 h-[min(90vw,90vh)] w-[min(90vw,90vh)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(0,255,0,0.08) 0%, rgba(0,255,0,0.03) 40%, transparent 70%)"
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-[min(60vw,60vh)] w-[min(60vw,60vh)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-omnitrix-green/10"
        style={{ boxShadow: "inset 0 0 80px rgba(0,255,0,0.06)" }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,0,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px"
        }}
      />
    </div>
  );
}
