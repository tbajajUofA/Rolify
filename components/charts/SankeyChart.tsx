"use client";

import * as d3 from "d3";
import { sankey, sankeyLinkHorizontal, sankeyLeft } from "d3-sankey";
import type { SankeyData } from "@/lib/transformData";
import { OMNITRIX, genreColorMap } from "./chartTheme";
import { useD3Chart } from "./useD3Chart";

type Props = { data: SankeyData };

type SankeyNodeDatum = { id: string; name: string; layer: string };
type SankeyLinkDatum = { source: string; target: string; value: number };

export function SankeyChart({ data }: Props) {
  const ref = useD3Chart(
    (svg, width, height) => {
      if (!data.nodes.length || !data.links.length) return;

      const margin = { top: 16, right: 16, bottom: 16, left: 16 };

      const genres = data.nodes.filter((n) => n.layer === "genre").map((n) => n.name);
      const colors = genreColorMap(genres);

      const graph = sankey<SankeyNodeDatum, SankeyLinkDatum>()
        .nodeId((d) => d.id)
        .nodeAlign(sankeyLeft)
        .nodeWidth(14)
        .nodePadding(10)
        .extent([
          [margin.left, margin.top],
          [width - margin.right, height - margin.bottom]
        ])({
        nodes: data.nodes.map((n) => ({ ...n })),
        links: data.links.map((l) => ({ ...l }))
      });

      const g = d3.select(svg).attr("viewBox", `0 0 ${width} ${height}`).append("g");

      const tooltip = d3
        .select(svg.parentElement)
        .append("div")
        .attr("class", "chart-tooltip")
        .style("opacity", 0);

      g.append("g")
        .selectAll("path")
        .data(graph.links)
        .join("path")
        .attr("d", sankeyLinkHorizontal())
        .attr("fill", "none")
        .attr("stroke", (d) => {
          const source = d.source as SankeyNodeDatum;
          if (source.layer === "genre") return colors.get(source.name) ?? OMNITRIX.green;
          return OMNITRIX.greenDim;
        })
        .attr("stroke-opacity", 0.35)
        .attr("stroke-width", (d) => Math.max(1, d.width ?? 1))
        .on("mouseenter", (_, d) => {
          const s = d.source as SankeyNodeDatum;
          const t = d.target as SankeyNodeDatum;
          tooltip
            .style("opacity", 1)
            .html(`<strong>${s.name}</strong> → <strong>${t.name}</strong><br/>flow: ${d.value}`);
        })
        .on("mousemove", (event) => {
          tooltip.style("left", `${event.offsetX + 12}px`).style("top", `${event.offsetY - 8}px`);
        })
        .on("mouseleave", () => tooltip.style("opacity", 0));

      g.append("g")
        .selectAll("rect")
        .data(graph.nodes)
        .join("rect")
        .attr("x", (d) => d.x0 ?? 0)
        .attr("y", (d) => d.y0 ?? 0)
        .attr("width", (d) => (d.x1 ?? 0) - (d.x0 ?? 0))
        .attr("height", (d) => (d.y1 ?? 0) - (d.y0 ?? 0))
        .attr("fill", (d) => {
          if (d.layer === "genre") return colors.get(d.name) ?? OMNITRIX.green;
          if (d.layer === "artist") return OMNITRIX.greenDim;
          return OMNITRIX.hourglass;
        })
        .attr("fill-opacity", 0.7)
        .attr("stroke", OMNITRIX.green)
        .attr("stroke-width", 0.5);

      g.append("g")
        .selectAll("text")
        .data(graph.nodes)
        .join("text")
        .attr("x", (d) => ((d.x0 ?? 0) < width / 2 ? (d.x1 ?? 0) + 6 : (d.x0 ?? 0) - 6))
        .attr("y", (d) => ((d.y0 ?? 0) + (d.y1 ?? 0)) / 2)
        .attr("text-anchor", (d) => ((d.x0 ?? 0) < width / 2 ? "start" : "end"))
        .attr("dominant-baseline", "middle")
        .attr("fill", OMNITRIX.textMuted)
        .attr("font-size", 10)
        .text((d) => (d.name.length > 18 ? `${d.name.slice(0, 16)}…` : d.name));

      return () => tooltip.remove();
    },
    [data]
  );

  return (
    <div className="chart-container">
      <svg ref={ref} className="h-full w-full" role="img" aria-label="Genre to track sankey diagram" />
    </div>
  );
}
