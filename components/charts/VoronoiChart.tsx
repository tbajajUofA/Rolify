"use client";

import * as d3 from "d3";
import { Delaunay } from "d3-delaunay";
import type { VoronoiCell } from "@/lib/transformData";
import { OMNITRIX, genreColorMap } from "./chartTheme";
import { useD3Chart } from "./useD3Chart";

type Props = { data: VoronoiCell[] };

export function VoronoiChart({ data }: Props) {
  const ref = useD3Chart(
    (svg, width, height) => {
      if (!data.length) return;

      const margin = 16;
      const innerW = width - margin * 2;
      const innerH = height - margin * 2;

      const genres = [...new Set(data.map((d) => d.genre))];
      const colors = genreColorMap(genres);
      const maxCount = d3.max(data, (d) => d.playCount) ?? 1;

      const points = data.map((d) => [d.x * innerW, d.y * innerH] as [number, number]);
      const delaunay = Delaunay.from(points);
      const voronoi = delaunay.voronoi([0, 0, innerW, innerH]);

      const tooltip = d3
        .select(svg.parentElement)
        .append("div")
        .attr("class", "chart-tooltip")
        .style("opacity", 0);

      const g = d3
        .select(svg)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .append("g")
        .attr("transform", `translate(${margin},${margin})`);

      g.selectAll("path.cell")
        .data(data)
        .join("path")
        .attr("class", "cell")
        .attr("d", (_, i) => voronoi.renderCell(i))
        .attr("fill", (d) => colors.get(d.genre) ?? OMNITRIX.green)
        .attr("fill-opacity", (d) => 0.15 + (d.playCount / maxCount) * 0.55)
        .attr("stroke", OMNITRIX.green)
        .attr("stroke-width", 1)
        .on("mouseenter", (_, d) => {
          tooltip
            .style("opacity", 1)
            .html(`<strong>${d.name}</strong><br/>${d.genre}<br/>territory: ${d.playCount}`);
        })
        .on("mousemove", (event) => {
          tooltip.style("left", `${event.offsetX + 12}px`).style("top", `${event.offsetY - 8}px`);
        })
        .on("mouseleave", () => tooltip.style("opacity", 0));

      g.selectAll("circle.site")
        .data(data)
        .join("circle")
        .attr("class", "site")
        .attr("cx", (d) => d.x * innerW)
        .attr("cy", (d) => d.y * innerH)
        .attr("r", (d) => 3 + (d.playCount / maxCount) * 8)
        .attr("fill", OMNITRIX.hourglass)
        .attr("stroke", OMNITRIX.green)
        .attr("stroke-width", 1.5);

      g.selectAll("text.label")
        .data(data)
        .join("text")
        .attr("class", "label")
        .attr("x", (d) => d.x * innerW)
        .attr("y", (d) => d.y * innerH - 12)
        .attr("text-anchor", "middle")
        .attr("fill", OMNITRIX.text)
        .attr("font-size", 9)
        .attr("pointer-events", "none")
        .text((d) => (d.name.length > 10 ? `${d.name.slice(0, 8)}…` : d.name));

      return () => tooltip.remove();
    },
    [data]
  );

  return (
    <div className="chart-container">
      <svg ref={ref} className="h-full w-full" role="img" aria-label="Artist territory voronoi diagram" />
    </div>
  );
}
