"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { Artist } from "@/lib/types";
import { SectionReveal } from "@/components/SectionReveal";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

type GraphNode = {
  id: string;
  name: string;
  genres: string[];
};

export function Constellations({ artists }: { artists: Artist[] }) {
  const graphData = useMemo(() => {
    const nodes = artists.map<GraphNode>((artist) => ({
      id: artist.id,
      name: artist.name,
      genres: artist.genres
    }));
    const links: { source: string; target: string }[] = [];

    nodes.forEach((artist, index) => {
      nodes.slice(index + 1).forEach((other) => {
        if (artist.genres.some((genre) => other.genres.includes(genre))) {
          links.push({ source: artist.id, target: other.id });
        }
      });
    });

    return { nodes, links: links.slice(0, 80) };
  }, [artists]);

  return (
    <SectionReveal
      eyebrow="05 / constellations"
      title="artists linked by shared genres"
      description="Genre overlap becomes a force-directed star map of your top artists."
    >
      <div className="panel h-[650px] overflow-hidden">
        <ForceGraph2D
          graphData={graphData}
          backgroundColor="rgba(0,0,0,0)"
          nodeRelSize={5}
          nodeColor={() => "#B5D4F4"}
          linkColor={() => "rgba(30,215,96,0.26)"}
          linkWidth={0.7}
          cooldownTicks={80}
          nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
            const label = node.name as string;
            const fontSize = 12 / globalScale;
            ctx.beginPath();
            ctx.arc(node.x, node.y, 4, 0, 2 * Math.PI, false);
            ctx.fillStyle = "#B5D4F4";
            ctx.shadowColor = "#00E5FF";
            ctx.shadowBlur = 14;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.font = `${fontSize}px JetBrains Mono, monospace`;
            ctx.fillStyle = "rgba(255,255,255,0.78)";
            ctx.fillText(label, node.x + 7, node.y + 4);
          }}
        />
      </div>
    </SectionReveal>
  );
}
