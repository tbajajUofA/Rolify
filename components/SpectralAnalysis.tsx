"use client";

import { Radar } from "react-chartjs-2";
import type { AudioFeatures } from "@/lib/types";
import { SectionReveal } from "@/components/SectionReveal";
import { chartGridColor, chartTextColor, commonChartOptions } from "@/components/chartTheme";

export function SpectralAnalysis({ features }: { features: AudioFeatures }) {
  return (
    <SectionReveal
      eyebrow="07 / spectral analysis"
      title="average signal profile"
      description="A telescope readout of synthetic audio characteristics across your long-term top tracks."
    >
      <div className="panel scanlines h-[560px] p-5">
        <Radar
          data={{
            labels: ["energy", "valence", "danceability", "acousticness", "tempo"],
            datasets: [
              {
                label: "average spectrum",
                data: [
                  features.energy,
                  features.valence,
                  features.danceability,
                  features.acousticness,
                  features.tempo
                ],
                borderColor: "#1ED760",
                backgroundColor: "rgba(29,185,84,0.24)",
                pointBackgroundColor: "#00E5FF",
                pointBorderColor: "#B5D4F4"
              }
            ]
          }}
          options={{
            ...commonChartOptions,
            scales: {
              r: {
                min: 0,
                max: 100,
                angleLines: { color: chartGridColor },
                grid: { color: chartGridColor },
                pointLabels: {
                  color: chartTextColor,
                  font: { family: "JetBrains Mono", size: 12 }
                },
                ticks: {
                  color: chartTextColor,
                  backdropColor: "transparent",
                  stepSize: 20
                }
              }
            }
          }}
        />
      </div>
    </SectionReveal>
  );
}
