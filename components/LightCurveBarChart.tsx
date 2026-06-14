"use client";

import { Bar } from "react-chartjs-2";
import type { Artist } from "@/lib/types";
import { SectionReveal } from "@/components/SectionReveal";
import { chartGridColor, chartTextColor, commonChartOptions } from "@/components/chartTheme";

export function LightCurveBarChart({ artists }: { artists: Artist[] }) {
  return (
    <SectionReveal
      eyebrow="09 / light curve"
      title="artist brightness by popularity"
      description="Spotify popularity stands in for play-count intensity where exact counts are unavailable."
    >
      <div className="panel h-[620px] p-5">
        <Bar
          data={{
            labels: artists.map((artist) => artist.name),
            datasets: [
              {
                label: "popularity score",
                data: artists.map((artist) => artist.popularity),
                backgroundColor: "rgba(30,215,96,0.82)",
                borderColor: "#B5D4F4",
                borderWidth: 1,
                borderRadius: 4
              }
            ]
          }}
          options={{
            ...commonChartOptions,
            indexAxis: "y",
            scales: {
              x: {
                min: 0,
                max: 100,
                grid: { color: chartGridColor },
                ticks: { color: chartTextColor }
              },
              y: {
                grid: { color: "rgba(255,255,255,0.04)" },
                ticks: { color: chartTextColor, font: { family: "JetBrains Mono" } }
              }
            }
          }}
        />
      </div>
    </SectionReveal>
  );
}
