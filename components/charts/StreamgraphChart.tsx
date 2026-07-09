"use client";

import * as d3 from "d3";
import type { StreamgraphLayer } from "@/lib/transformData";
import { OMNITRIX, genreColorMap } from "./chartTheme";
import { useD3Chart } from "./useD3Chart";

type Props = { data: StreamgraphLayer[] };

export function StreamgraphChart({ data }: Props) {
  const ref = useD3Chart(
    (svg, width, height) => {
      if (!data.length) return;

      const margin = { top: 20, right: 20, bottom: 36, left: 40 };
      const innerW = width - margin.left - margin.right;
      const innerH = height - margin.top - margin.bottom;

      const dates = data[0]?.values.map((v) => v.date) ?? [];
      const keys = data.map((d) => d.genre);
      const colors = genreColorMap(keys);

      const seriesData = dates.map((date, i) => {
        const row: Record<string, number | Date> = { date };
        data.forEach((layer) => {
          row[layer.genre] = layer.values[i]?.value ?? 0;
        });
        return row;
      });

      const stack = d3
        .stack<Record<string, number | Date>>()
        .keys(keys)
        .offset(d3.stackOffsetWiggle)
        .order(d3.stackOrderInsideOut);

      const stacked = stack(seriesData);

      const x = d3
        .scaleTime()
        .domain(d3.extent(dates) as [Date, Date])
        .range([0, innerW]);

      const yMax = d3.max(stacked, (layer) => d3.max(layer, (d) => d[1])) ?? 1;
      const yMin = d3.min(stacked, (layer) => d3.min(layer, (d) => d[0])) ?? 0;

      const y = d3.scaleLinear().domain([yMin, yMax]).range([innerH, 0]);

      const area = d3
        .area<d3.SeriesPoint<Record<string, number | Date>>>()
        .x((d) => x(d.data.date as Date))
        .y0((d) => y(d[0]))
        .y1((d) => y(d[1]))
        .curve(d3.curveBasis);

      const g = d3
        .select(svg)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      g.selectAll("path.layer")
        .data(stacked)
        .join("path")
        .attr("class", "layer")
        .attr("d", area)
        .attr("fill", (d) => colors.get(d.key) ?? OMNITRIX.green)
        .attr("fill-opacity", 0.55)
        .attr("stroke", OMNITRIX.black)
        .attr("stroke-width", 0.5);

      g.append("g")
        .attr("transform", `translate(0,${innerH})`)
        .call(
          d3
            .axisBottom(x)
            .ticks(Math.min(6, dates.length))
            .tickFormat((d) => d3.timeFormat("%b %d")(d as Date))
        )
        .call((sel) => sel.selectAll("text").attr("fill", OMNITRIX.textMuted).attr("font-size", 10))
        .call((sel) => sel.selectAll("line, path").attr("stroke", OMNITRIX.grid));

      const legend = g.append("g").attr("transform", `translate(0, ${innerH + 24})`);
      keys.slice(0, 6).forEach((key, i) => {
        const item = legend.append("g").attr("transform", `translate(${i * 100}, 0)`);
        item.append("rect").attr("width", 10).attr("height", 10).attr("fill", colors.get(key) ?? OMNITRIX.green);
        item
          .append("text")
          .attr("x", 14)
          .attr("y", 9)
          .attr("fill", OMNITRIX.textMuted)
          .attr("font-size", 9)
          .text(key.length > 10 ? `${key.slice(0, 8)}…` : key);
      });
    },
    [data]
  );

  return (
    <div className="chart-container">
      <svg ref={ref} className="h-full w-full" role="img" aria-label="Genre streamgraph over time" />
    </div>
  );
}
