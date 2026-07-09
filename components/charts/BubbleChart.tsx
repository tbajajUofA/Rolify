"use client";

import * as d3 from "d3";
import type { BubblePoint } from "@/lib/transformData";
import { OMNITRIX, genreColorMap } from "./chartTheme";
import { useD3Chart } from "./useD3Chart";

type Props = { data: BubblePoint[] };
type SimNode = BubblePoint & d3.SimulationNodeDatum;

export function BubbleChart({ data }: Props) {
  const ref = useD3Chart(
    (svg, width, height) => {
      if (!data.length) return;

      const margin = { top: 24, right: 24, bottom: 40, left: 24 };
      const innerW = width - margin.left - margin.right;
      const innerH = height - margin.top - margin.bottom;

      const g = d3
        .select(svg)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const genres = [...new Set(data.map((d) => d.genre))];
      const colors = genreColorMap(genres);

      const maxCount = d3.max(data, (d) => d.playCount) ?? 1;
      const radius = d3.scaleSqrt().domain([0, maxCount]).range([8, 52]);

      const simulation = d3
        .forceSimulation<SimNode>(data as SimNode[])
        .force("x", d3.forceX(innerW / 2).strength(0.06))
        .force("y", d3.forceY(innerH / 2).strength(0.06))
        .force(
          "collide",
          d3.forceCollide<SimNode>().radius((d) => radius(d.playCount) + 2)
        )
        .force("charge", d3.forceManyBody().strength(-12))
        .stop();

      for (let i = 0; i < 120; i += 1) simulation.tick();

      const tooltip = d3
        .select(svg.parentElement)
        .append("div")
        .attr("class", "chart-tooltip")
        .style("opacity", 0);

      const nodes = g
        .selectAll<SVGGElement, SimNode>("g.node")
        .data(data as SimNode[])
        .join("g")
        .attr("transform", (d) => `translate(${d.x ?? innerW / 2},${d.y ?? innerH / 2})`);

      nodes
        .append("circle")
        .attr("r", (d) => radius(d.playCount))
        .attr("fill", (d) => colors.get(d.genre) ?? OMNITRIX.green)
        .attr("fill-opacity", 0.35)
        .attr("stroke", (d) => colors.get(d.genre) ?? OMNITRIX.green)
        .attr("stroke-width", 1.5);

      nodes
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("fill", OMNITRIX.text)
        .attr("font-size", (d) => Math.min(11, radius(d.playCount) * 0.38))
        .attr("pointer-events", "none")
        .text((d) => (d.name.length > 12 ? `${d.name.slice(0, 10)}…` : d.name));

      nodes
        .on("mouseenter", (_, d) => {
          tooltip
            .style("opacity", 1)
            .html(`<strong>${d.name}</strong><br/>${d.genre}<br/>weight: ${d.playCount}`);
        })
        .on("mousemove", (event) => {
          tooltip.style("left", `${event.offsetX + 12}px`).style("top", `${event.offsetY - 8}px`);
        })
        .on("mouseleave", () => tooltip.style("opacity", 0));

      const legend = g
        .append("g")
        .attr("transform", `translate(0, ${innerH + 8})`);

      genres.slice(0, 6).forEach((genre, i) => {
        const item = legend.append("g").attr("transform", `translate(${i * 110}, 0)`);
        item
          .append("circle")
          .attr("r", 4)
          .attr("fill", colors.get(genre) ?? OMNITRIX.green);
        item
          .append("text")
          .attr("x", 10)
          .attr("y", 4)
          .attr("fill", OMNITRIX.textMuted)
          .attr("font-size", 10)
          .text(genre.length > 12 ? `${genre.slice(0, 10)}…` : genre);
      });

      return () => {
        tooltip.remove();
      };
    },
    [data]
  );

  return (
    <div className="chart-container">
      <svg ref={ref} className="h-full w-full" role="img" aria-label="Top artists bubble chart" />
    </div>
  );
}
