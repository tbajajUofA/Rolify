"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { ChartData } from "@/lib/transformData";
import { BeeswarmChart } from "@/components/charts/BeeswarmChart";
import { BubbleChart } from "@/components/charts/BubbleChart";
import { CalendarHeatmap } from "@/components/charts/CalendarHeatmap";
import { ChordChart } from "@/components/charts/ChordChart";
import { RadarChart } from "@/components/charts/RadarChart";
import { SankeyChart } from "@/components/charts/SankeyChart";
import { StreamgraphChart } from "@/components/charts/StreamgraphChart";
import { VoronoiChart } from "@/components/charts/VoronoiChart";
import { OmnitrixDial } from "@/components/OmnitrixDial";
import { ALIEN_FORMS, type FormId } from "@/components/omnitrixForms";

type Props = {
  chartData: ChartData;
  displayName: string;
};

function ChartView({ formId, data }: { formId: FormId; data: ChartData }) {
  switch (formId) {
    case "bubble":
      return <BubbleChart data={data.bubble} />;
    case "radar":
      return <RadarChart data={data.radar} />;
    case "sankey":
      return <SankeyChart data={data.sankey} />;
    case "chord":
      return <ChordChart data={data.chord} />;
    case "streamgraph":
      return <StreamgraphChart data={data.streamgraph} />;
    case "heatmap":
      return <CalendarHeatmap data={data.heatmap} />;
    case "beeswarm":
      return <BeeswarmChart data={data.beeswarm} />;
    case "voronoi":
      return <VoronoiChart data={data.voronoi} />;
    default:
      return null;
  }
}

export function OmnitrixDashboard({ chartData, displayName }: Props) {
  const [active, setActive] = useState<FormId>("bubble");
  const [transforming, setTransforming] = useState(false);
  const activeForm = ALIEN_FORMS.find((f) => f.id === active)!;

  const handleSelect = (id: FormId) => {
    if (id === active) return;
    setTransforming(true);
    setActive(id);
    window.setTimeout(() => setTransforming(false), 600);
  };

  return (
    <div className="relative min-h-screen pb-8 pt-20">
      <header className="fixed left-0 right-0 top-0 z-30 border-b border-omnitrix-green/20 bg-black/80 px-5 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm uppercase tracking-[0.2em] text-omnitrix-green sm:text-base">
              Wacky Charts
            </span>
            <span className="hidden font-mono text-[0.6rem] uppercase tracking-[0.25em] text-omnitrix-hourglass/70 sm:inline">
              ◷ feat. spotify data
            </span>
          </div>
          <span className="truncate font-mono text-[0.65rem] uppercase tracking-[0.15em] text-white/55">
            {displayName}
          </span>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 lg:flex-row lg:items-start lg:gap-10 lg:px-8">
        <aside className="flex shrink-0 justify-center lg:sticky lg:top-24 lg:w-[280px]">
          <OmnitrixDial active={active} onSelect={handleSelect} />
        </aside>

        <section className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-omnitrix-green/50">
              {transforming ? "transforming…" : activeForm.scanLine}
            </p>
            {transforming && (
              <motion.span
                className="inline-block h-2 w-2 rounded-full bg-omnitrix-green shadow-omnitrix-glow"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              />
            )}
          </div>

          <div className="omnitrix-panel scanlines relative overflow-hidden rounded-lg border border-omnitrix-green/25 bg-omnitrix-face/90 p-4 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.02, filter: "blur(4px)" }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="chart-stage h-[420px] sm:h-[480px] lg:h-[520px]"
              >
                <ChartView formId={active} data={chartData} />
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="mt-4 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/35">
            Select an alien form on the dial to transform your listening data view
          </p>
        </section>
      </div>
    </div>
  );
}
