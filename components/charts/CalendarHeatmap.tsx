"use client";

import * as d3 from "d3";
import type { HeatmapCell } from "@/lib/transformData";
import { OMNITRIX } from "./chartTheme";
import { useD3Chart } from "./useD3Chart";

type Props = { data: HeatmapCell[] };

export function CalendarHeatmap({ data }: Props) {
  const ref = useD3Chart(
    (svg, width, height) => {
      if (!data.length) return;

      const margin = { top: 24, right: 16, bottom: 16, left: 16 };
      const cellSize = Math.min(18, (width - margin.left - margin.right) / 53);
      const countMap = new Map(data.map((d) => [d.date, d.count]));
      const maxCount = d3.max(data, (d) => d.count) ?? 1;

      const dates = data.map((d) => new Date(`${d.date}T12:00:00`));
      const start = d3.min(dates) ?? new Date();
      const end = d3.max(dates) ?? new Date();

      const weeks = d3.timeWeeks(d3.timeWeek.floor(start), d3.timeWeek.ceil(end));
      const color = d3
        .scaleSequential(d3.interpolateGreens)
        .domain([0, maxCount]);

      const g = d3
        .select(svg)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const dayLabels = ["", "M", "", "W", "", "F", ""];
      dayLabels.forEach((label, i) => {
        if (!label) return;
        g.append("text")
          .attr("x", -8)
          .attr("y", i * cellSize + cellSize * 0.75)
          .attr("text-anchor", "end")
          .attr("fill", OMNITRIX.textMuted)
          .attr("font-size", 9)
          .text(label);
      });

      weeks.forEach((weekStart, wi) => {
        const weekDays = d3.timeDays(weekStart, d3.timeWeek.offset(weekStart, 1));
        weekDays.forEach((day) => {
          const key = day.toISOString().slice(0, 10);
          const count = countMap.get(key) ?? 0;
          const dow = day.getDay();

          g.append("rect")
            .attr("x", wi * (cellSize + 2))
            .attr("y", dow * (cellSize + 2))
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("rx", 2)
            .attr("fill", count > 0 ? color(count) : OMNITRIX.panel)
            .attr("stroke", count > 0 ? OMNITRIX.green : OMNITRIX.grid)
            .attr("stroke-width", 0.5)
            .append("title")
            .text(`${key}: ${count} plays`);
        });
      });

      g.append("text")
        .attr("x", 0)
        .attr("y", -8)
        .attr("fill", OMNITRIX.textMuted)
        .attr("font-size", 10)
        .text("Daily listening intensity");
    },
    [data]
  );

  return (
    <div className="chart-container">
      <svg ref={ref} className="h-full w-full" role="img" aria-label="Calendar heatmap of listening activity" />
    </div>
  );
}
