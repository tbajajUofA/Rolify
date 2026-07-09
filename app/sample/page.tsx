import Link from "next/link";
import { buildChartData } from "@/lib/transformData";
import { getSampleSourceData, SAMPLE_DISPLAY_NAME } from "@/lib/sampleData";
import { OmnitrixBackground } from "@/components/OmnitrixBackground";
import { OmnitrixDashboard } from "@/components/OmnitrixDashboard";

export const metadata = {
  title: "Wacky Charts feat. Spotify Data — Sample",
  description: "Preview all Omnitrix visualization forms with demo listening data."
};

export default function SamplePage() {
  const chartData = buildChartData(getSampleSourceData());

  return (
    <main className="relative min-h-screen bg-black text-white">
      <OmnitrixBackground />
      <div className="fixed left-0 right-0 top-14 z-20 px-5">
        <div className="mx-auto flex max-w-7xl justify-center">
          <span className="rounded-full border border-omnitrix-hourglass/40 bg-black/80 px-4 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-omnitrix-hourglass">
            ◷ demo mode — fake data
          </span>
        </div>
      </div>
      <OmnitrixDashboard chartData={chartData} displayName={SAMPLE_DISPLAY_NAME} />
      <footer className="relative z-10 pb-8 text-center">
        <Link
          href="/"
          className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-omnitrix-green/50 transition hover:text-omnitrix-green"
        >
          ← Link real Spotify account
        </Link>
      </footer>
    </main>
  );
}
