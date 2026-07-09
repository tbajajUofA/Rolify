"use client";

import * as d3 from "d3";
import type { RadarAxis } from "@/lib/transformData";
import { OMNITRIX } from "./chartTheme";
import { useD3Chart } from "./useD3Chart";

type Props = { data: RadarAxis[] };

export function RadarChart({ data }: Props) {
  const ref = useD3Chart(
    (svg, width, height) => {
      if (!data.length) return;

      const cx = width / 2;
      const cy = height / 2;
      const maxR = Math.min(width, height) * 0.34;
      const levels = 4;

      const root = d3
        .select(svg)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .append("g")
        .attr("transform", `translate(${cx},${cy})`);

      const angle = (i: number) => (Math.PI * 2 * i) / data.length - Math.PI / 2;
      const rScale = d3.scaleLinear().domain([0, 100]).range([0, maxR]);

      for (let level = 1; level <= levels; level += 1) {
        const r = (maxR / levels) * level;
        root
          .append("circle")
          .attr("r", r)
          .attr("fill", "none")
          .attr("stroke", OMNITRIX.grid)
          .attr("stroke-width", 1);
      }

      data.forEach((_, i) => {
        root
          .append("line")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", Math.cos(angle(i)) * maxR)
          .attr("y2", Math.sin(angle(i)) * maxR)
          .attr("stroke", OMNITRIX.grid)
          .attr("stroke-width", 1);

        root
          .append("text")
          .attr("x", Math.cos(angle(i)) * (maxR + 18))
          .attr("y", Math.sin(angle(i)) * (maxR + 18))
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("fill", OMNITRIX.textMuted)
          .attr("font-size", 11)
          .text((() => {
            const label = data[i].genre;
            return label.length > 14 ? `${label.slice(0, 12)}…` : label;
          })());
      });

      const line = d3
        .line<RadarAxis>()
        .x((d, i) => Math.cos(angle(i)) * rScale(d.value))
        .y((d, i) => Math.sin(angle(i)) * rScale(d.value))
        .curve(d3.curveLinearClosed);

      root
        .append("path")
        .datum(data)
        .attr("d", line)
        .attr("fill", OMNITRIX.green)
        .attr("fill-opacity", 0.18)
        .attr("stroke", OMNITRIX.green)
        .attr("stroke-width", 2);

      root
        .selectAll("circle.point")
        .data(data)
        .join("circle")
        .attr("class", "point")
        .attr("cx", (d, i) => Math.cos(angle(i)) * rScale(d.value))
        .attr("cy", (d, i) => Math.sin(angle(i)) * rScale(d.value))
        .attr("r", 4)
        .attr("fill", OMNITRIX.hourglass)
        .attr("stroke", OMNITRIX.green)
        .attr("stroke-width", 1.5);
    },
    [data]
  );

  return (
    <div className="chart-container">
      <svg ref={ref} className="h-full w-full" role="img" aria-label="Genre taste radar chart" />
    </div>
  );
}
