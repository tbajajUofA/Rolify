"use client";

import { Doughnut } from "react-chartjs-2";
import type { GenreCount } from "@/lib/types";
import { SectionReveal } from "@/components/SectionReveal";
import { commonChartOptions } from "@/components/chartTheme";

const COLORS = ["#1ED760", "#00E5FF", "#7F77DD", "#D4537E", "#FAC775", "#B5D4F4"];

export function GenreStarSystem({ genres }: { genres: GenreCount[] }) {
  return (
    <SectionReveal
      eyebrow="10 / genre star system"
      title="genre distribution in orbit"
      description="Top artist genres become a bright ring system around the center of your music universe."
    >
      <div className="panel relative h-[560px] p-5">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 animate-slowSpin rounded-full border border-spotify-green/40" />
        <Doughnut
          data={{
            labels: genres.map((genre) => genre.genre),
            datasets: [
              {
                data: genres.map((genre) => genre.count),
                backgroundColor: genres.map((_, index) => COLORS[index % COLORS.length]),
                borderColor: "#000000",
                borderWidth: 3,
                hoverOffset: 8
              }
            ]
          }}
          options={{
            ...commonChartOptions,
            cutout: "64%"
          }}
        />
      </div>
    </SectionReveal>
  );
}
