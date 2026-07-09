"use client";

import * as d3 from "d3";
import type { ChordData } from "@/lib/transformData";
import { OMNITRIX, genreColor } from "./chartTheme";
import { useD3Chart } from "./useD3Chart";

type Props = { data: ChordData };

export function ChordChart({ data }: Props) {
  const ref = useD3Chart(
    (svg, width, height) => {
      if (!data.labels.length) return;

      const cx = width / 2;
      const cy = height / 2;
      const outerR = Math.min(width, height) * 0.38;
      const innerR = outerR - 22;

      const chordGen = d3
        .chord()
        .padAngle(0.06)
        .sortSubgroups(d3.descending)(data.matrix);

      const arc = d3.arc().innerRadius(innerR).outerRadius(outerR);
      const ribbon = d3.ribbon().radius(innerR);

      const root = d3
        .select(svg)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .append("g")
        .attr("transform", `translate(${cx},${cy})`);

      root
        .append("g")
        .selectAll("path")
        .data(chordGen.groups)
        .join("path")
        .attr("d", arc as never)
        .attr("fill", (_, i) => genreColor(i))
        .attr("fill-opacity", 0.75)
        .attr("stroke", OMNITRIX.black)
        .attr("stroke-width", 1);

      root
        .append("g")
        .attr("fill-opacity", 0.55)
        .selectAll("path")
        .data(chordGen)
        .join("path")
        .attr("d", ribbon as never)
        .attr("fill", (d) => genreColor(d.source.index))
        .attr("stroke", OMNITRIX.green)
        .attr("stroke-width", 0.3);

      root
        .append("g")
        .selectAll("text")
        .data(chordGen.groups)
        .join("text")
        .each(function (_, i) {
          const angle = (((i + 0.5) / data.labels.length) * 360 - 90) * (Math.PI / 180);
          d3.select(this)
            .attr("transform", `rotate(${(angle * 180) / Math.PI})`)
            .attr("x", outerR + 8)
            .attr("text-anchor", angle > Math.PI / 2 && angle < (Math.PI * 3) / 2 ? "end" : "start")
            .attr("fill", OMNITRIX.textMuted)
            .attr("font-size", 10)
            .text(() => {
              const label = data.labels[i];
              return label.length > 12 ? `${label.slice(0, 10)}…` : label;
            });
        });
    },
    [data]
  );

  return (
    <div className="chart-container">
      <svg ref={ref} className="h-full w-full" role="img" aria-label="Genre co-occurrence chord diagram" />
    </div>
  );
}
