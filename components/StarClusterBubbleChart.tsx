"use client";

import { Bubble } from "react-chartjs-2";
import type { VisualTrack } from "@/lib/types";
import { SectionReveal } from "@/components/SectionReveal";
import { chartGridColor, chartTextColor, commonChartOptions } from "@/components/chartTheme";

export function StarClusterBubbleChart({ tracks }: { tracks: VisualTrack[] }) {
  return (
    <SectionReveal
      eyebrow="08 / star cluster"
      title="tracks as glowing bubbles"
      description="Popularity controls star size while cluster color reveals the synthetic sound family."
    >
      <div className="panel h-[560px] p-5">
        <Bubble
          data={{
            datasets: tracks.map((track) => ({
              label: track.name,
              data: [
                {
                  x: track.features.energy,
                  y: track.features.valence,
                  r: 4 + track.popularity / 9
                }
              ],
              backgroundColor: track.clusterColor,
              borderColor: "#ffffff",
              borderWidth: 0.5
            }))
          }}
          options={{
            ...commonChartOptions,
            scales: {
              x: {
                min: 0,
                max: 100,
                title: { display: true, text: "energy", color: chartTextColor },
                grid: { color: chartGridColor },
                ticks: { color: chartTextColor }
              },
              y: {
                min: 0,
                max: 100,
                title: { display: true, text: "valence", color: chartTextColor },
                grid: { color: chartGridColor },
                ticks: { color: chartTextColor }
              }
            },
            plugins: {
              ...commonChartOptions.plugins,
              legend: { display: false }
            }
          }}
        />
      </div>
    </SectionReveal>
  );
}
