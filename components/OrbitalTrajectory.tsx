"use client";

import { Line } from "react-chartjs-2";
import type { TrajectoryPoint } from "@/lib/types";
import { SectionReveal } from "@/components/SectionReveal";
import { chartGridColor, chartTextColor, commonChartOptions } from "@/components/chartTheme";

export function OrbitalTrajectory({ points }: { points: TrajectoryPoint[] }) {
  return (
    <SectionReveal
      eyebrow="11 / orbital trajectory"
      title="recent plays tracing a path"
      description="Recently played tracks grouped by day form a glowing listening trajectory."
    >
      <div className="panel h-[520px] p-5">
        <Line
          data={{
            labels: points.map((point) => point.day),
            datasets: [
              {
                label: "recent plays",
                data: points.map((point) => point.count),
                borderColor: "#1ED760",
                backgroundColor: "rgba(29,185,84,0.18)",
                pointBackgroundColor: "#00E5FF",
                pointBorderColor: "#B5D4F4",
                pointRadius: 5,
                tension: 0.42,
                fill: true
              }
            ]
          }}
          options={{
            ...commonChartOptions,
            scales: {
              x: {
                grid: { color: chartGridColor },
                ticks: { color: chartTextColor, font: { family: "JetBrains Mono" } }
              },
              y: {
                beginAtZero: true,
                grid: { color: chartGridColor },
                ticks: { color: chartTextColor, precision: 0 }
              }
            }
          }}
        />
      </div>
    </SectionReveal>
  );
}
