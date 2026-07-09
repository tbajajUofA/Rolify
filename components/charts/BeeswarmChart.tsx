"use client";

import * as d3 from "d3";
import type { BeeswarmPoint } from "@/lib/transformData";
import { OMNITRIX, genreColorMap } from "./chartTheme";
import { useD3Chart } from "./useD3Chart";

type Props = { data: BeeswarmPoint[] };
type SimNode = BeeswarmPoint & d3.SimulationNodeDatum;

export function BeeswarmChart({ data }: Props) {
  const ref = useD3Chart(
    (svg, width, height) => {
      if (!data.length) return;

      const margin = { top: 24, right: 24, bottom: 48, left: 48 };
      const innerW = width - margin.left - margin.right;
      const innerH = height - margin.top - margin.bottom;

      const clusters = [...new Set(data.map((d) => d.cluster))];
      const colors = genreColorMap(clusters);

      const x = d3.scaleLinear().domain([0, 100]).range([0, innerW]);
      const y = d3.scaleLinear().domain([0, 100]).range([innerH, 0]);

      const simulation = d3
        .forceSimulation<SimNode>(data as SimNode[])
        .force("x", d3.forceX<SimNode>((d) => x(d.tempo)).strength(1))
        .force("y", d3.forceY<SimNode>((d) => y(d.popularity)).strength(1))
        .force("collide", d3.forceCollide(7))
        .stop();

      for (let i = 0; i < 100; i += 1) simulation.tick();

      const tooltip = d3
        .select(svg.parentElement)
        .append("div")
        .attr("class", "chart-tooltip")
        .style("opacity", 0);

      const g = d3
        .select(svg)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      g.append("g")
        .attr("transform", `translate(0,${innerH})`)
        .call(d3.axisBottom(x).ticks(6))
        .call((sel) => sel.selectAll("text").attr("fill", OMNITRIX.textMuted).attr("font-size", 10))
        .call((sel) => sel.selectAll("line, path").attr("stroke", OMNITRIX.grid));

      g.append("g")
        .call(d3.axisLeft(y).ticks(6))
        .call((sel) => sel.selectAll("text").attr("fill", OMNITRIX.textMuted).attr("font-size", 10))
        .call((sel) => sel.selectAll("line, path").attr("stroke", OMNITRIX.grid));

      g.append("text")
        .attr("x", innerW / 2)
        .attr("y", innerH + 36)
        .attr("text-anchor", "middle")
        .attr("fill", OMNITRIX.textMuted)
        .attr("font-size", 11)
        .text("Tempo");

      g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerH / 2)
        .attr("y", -36)
        .attr("text-anchor", "middle")
        .attr("fill", OMNITRIX.textMuted)
        .attr("font-size", 11)
        .text("Popularity");

      g.selectAll<SVGCircleElement, SimNode>("circle")
        .data(data as SimNode[])
        .join("circle")
        .attr("cx", (d) => d.x ?? x(d.tempo))
        .attr("cy", (d) => d.y ?? y(d.popularity))
        .attr("r", 5)
        .attr("fill", (d) => colors.get(d.cluster) ?? OMNITRIX.green)
        .attr("fill-opacity", 0.7)
        .attr("stroke", OMNITRIX.green)
        .attr("stroke-width", 1)
        .on("mouseenter", (_, d) => {
          tooltip
            .style("opacity", 1)
            .html(`<strong>${d.name}</strong><br/>${d.cluster}<br/>tempo ${d.tempo} · pop ${d.popularity}`);
        })
        .on("mousemove", (event) => {
          tooltip.style("left", `${event.offsetX + 12}px`).style("top", `${event.offsetY - 8}px`);
        })
        .on("mouseleave", () => tooltip.style("opacity", 0));

      const legend = g.append("g").attr("transform", `translate(${innerW - 120}, 0)`);
      clusters.forEach((cluster, i) => {
        const item = legend.append("g").attr("transform", `translate(0, ${i * 18})`);
        item.append("circle").attr("r", 4).attr("fill", colors.get(cluster) ?? OMNITRIX.green);
        item
          .append("text")
          .attr("x", 10)
          .attr("y", 4)
          .attr("fill", OMNITRIX.textMuted)
          .attr("font-size", 10)
          .text(cluster);
      });

      return () => tooltip.remove();
    },
    [data]
  );

  return (
    <div className="chart-container">
      <svg ref={ref} className="h-full w-full" role="img" aria-label="Track beeswarm by tempo and popularity" />
    </div>
  );
}
