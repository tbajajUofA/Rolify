export const OMNITRIX = {
  green: "#00FF00",
  greenDim: "#00CC00",
  greenGlow: "rgba(0, 255, 0, 0.45)",
  black: "#000000",
  face: "#0a0f0a",
  panel: "#111811",
  border: "rgba(0, 255, 0, 0.25)",
  hourglass: "#FFD700",
  text: "#e8ffe8",
  textMuted: "rgba(232, 255, 232, 0.55)",
  grid: "rgba(0, 255, 0, 0.12)"
} as const;

export const GENRE_COLORS = [
  "#00FF00",
  "#FFD700",
  "#00E5FF",
  "#FF6B35",
  "#B388FF",
  "#FF4081",
  "#69F0AE",
  "#40C4FF",
  "#FFAB40",
  "#EA80FC"
];

export function genreColor(index: number): string {
  return GENRE_COLORS[index % GENRE_COLORS.length];
}

export function genreColorMap(genres: string[]): Map<string, string> {
  const map = new Map<string, string>();
  genres.forEach((genre, i) => map.set(genre, genreColor(i)));
  return map;
}
