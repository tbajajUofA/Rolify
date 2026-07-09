import { getMockAudioFeatures } from "@/lib/mockAudioFeatures";
import type { Artist, RecentlyPlayedTrack, Track } from "@/lib/types";

export type SourceData = {
  topArtists: Artist[];
  topTracks: Track[];
  recentlyPlayed: RecentlyPlayedTrack[];
};

export type BubblePoint = {
  id: string;
  name: string;
  playCount: number;
  genre: string;
  popularity: number;
};

export type RadarAxis = {
  genre: string;
  value: number;
};

export type SankeyNode = {
  id: string;
  name: string;
  layer: "genre" | "artist" | "track";
};

export type SankeyLink = {
  source: string;
  target: string;
  value: number;
};

export type SankeyData = {
  nodes: SankeyNode[];
  links: SankeyLink[];
};

export type ChordData = {
  labels: string[];
  matrix: number[][];
};

export type StreamgraphLayer = {
  genre: string;
  values: { date: Date; value: number }[];
};

export type HeatmapCell = {
  date: string;
  count: number;
};

export type BeeswarmPoint = {
  id: string;
  name: string;
  tempo: number;
  popularity: number;
  cluster: string;
};

export type VoronoiCell = {
  id: string;
  name: string;
  playCount: number;
  genre: string;
  x: number;
  y: number;
};

export type ChartData = {
  bubble: BubblePoint[];
  radar: RadarAxis[];
  sankey: SankeyData;
  chord: ChordData;
  streamgraph: StreamgraphLayer[];
  heatmap: HeatmapCell[];
  beeswarm: BeeswarmPoint[];
  voronoi: VoronoiCell[];
};

function enrichTrackGenres(tracks: Track[], artists: Artist[]): Track[] {
  const genreByArtist = new Map(artists.map((artist) => [artist.id, artist.genres]));

  return tracks.map((track) => ({
    ...track,
    artists: track.artists.map((artist) => ({
      ...artist,
      genres: artist.genres.length > 0 ? artist.genres : genreByArtist.get(artist.id) ?? []
    }))
  }));
}

function primaryGenre(artist: Artist): string {
  return artist.genres[0] ?? "unknown";
}

function trackPrimaryGenre(track: Track): string {
  const genres = track.artists.flatMap((artist) => artist.genres);
  return genres[0] ?? "unknown";
}

function artistPlayCounts(tracks: Track[]): Map<string, number> {
  const counts = new Map<string, number>();

  tracks.forEach((track, index) => {
    const weight = tracks.length - index;
    track.artists.forEach((artist) => {
      counts.set(artist.id, (counts.get(artist.id) ?? 0) + weight);
    });
  });

  return counts;
}

function genreCounts(artists: Artist[]): Map<string, number> {
  const counts = new Map<string, number>();

  artists.forEach((artist) => {
    artist.genres.forEach((genre) => {
      counts.set(genre, (counts.get(genre) ?? 0) + 1);
    });
  });

  return counts;
}

function buildBubbleData(artists: Artist[], tracks: Track[]): BubblePoint[] {
  const counts = artistPlayCounts(tracks);

  return artists.slice(0, 20).map((artist) => ({
    id: artist.id,
    name: artist.name,
    playCount: counts.get(artist.id) ?? artist.popularity,
    genre: primaryGenre(artist),
    popularity: artist.popularity
  }));
}

function buildRadarData(artists: Artist[]): RadarAxis[] {
  const counts = genreCounts(artists);
  const top = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const max = top[0]?.[1] ?? 1;

  return top.map(([genre, count]) => ({
    genre,
    value: Math.round((count / max) * 100)
  }));
}

function buildSankeyData(artists: Artist[], tracks: Track[]): SankeyData {
  const nodes: SankeyNode[] = [];
  const links: SankeyLink[] = [];
  const nodeIds = new Set<string>();

  const addNode = (id: string, name: string, layer: SankeyNode["layer"]) => {
    if (!nodeIds.has(id)) {
      nodeIds.add(id);
      nodes.push({ id, name, layer });
    }
  };

  const topArtists = artists.slice(0, 12);
  const topTracks = tracks.slice(0, 15);

  topArtists.forEach((artist) => {
    const genre = primaryGenre(artist);
    const genreId = `genre:${genre}`;
    const artistId = `artist:${artist.id}`;

    addNode(genreId, genre, "genre");
    addNode(artistId, artist.name, "artist");
    links.push({ source: genreId, target: artistId, value: 2 });
  });

  topTracks.forEach((track, index) => {
    const trackId = `track:${track.id}`;
    addNode(trackId, track.name, "track");

    track.artists.forEach((artist) => {
      const artistId = `artist:${artist.id}`;
      if (nodeIds.has(artistId)) {
        links.push({ source: artistId, target: trackId, value: Math.max(1, 15 - index) });
      }
    });
  });

  return { nodes, links };
}

function buildChordData(artists: Artist[]): ChordData {
  const counts = genreCounts(artists);
  const labels = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([genre]) => genre);

  const index = new Map(labels.map((label, i) => [label, i]));
  const matrix = labels.map(() => labels.map(() => 0));

  artists.forEach((artist) => {
    const artistGenres = artist.genres.filter((g) => index.has(g));
    for (let i = 0; i < artistGenres.length; i += 1) {
      for (let j = i + 1; j < artistGenres.length; j += 1) {
        const a = index.get(artistGenres[i])!;
        const b = index.get(artistGenres[j])!;
        matrix[a][b] += 1;
        matrix[b][a] += 1;
      }
    }
  });

  return { labels, matrix };
}

function buildStreamgraphData(recentlyPlayed: RecentlyPlayedTrack[], artists: Artist[]): StreamgraphLayer[] {
  const enriched = enrichTrackGenres(
    recentlyPlayed.map((item) => item.track),
    artists
  );

  const byDay = new Map<string, Map<string, number>>();

  recentlyPlayed.forEach((item, i) => {
    const date = item.playedAt.slice(0, 10);
    const genre = trackPrimaryGenre(enriched[i] ?? item.track);
    if (!byDay.has(date)) byDay.set(date, new Map());
    const dayMap = byDay.get(date)!;
    dayMap.set(genre, (dayMap.get(genre) ?? 0) + 1);
  });

  const allGenres = new Set<string>();
  byDay.forEach((dayMap) => dayMap.forEach((_, genre) => allGenres.add(genre)));

  const topGenres = Array.from(allGenres)
    .map((genre) => {
      let total = 0;
      byDay.forEach((dayMap) => {
        total += dayMap.get(genre) ?? 0;
      });
      return { genre, total };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 6)
    .map((g) => g.genre);

  const sortedDates = Array.from(byDay.keys()).sort();

  return topGenres.map((genre) => ({
    genre,
    values: sortedDates.map((date) => ({
      date: new Date(`${date}T12:00:00`),
      value: byDay.get(date)?.get(genre) ?? 0
    }))
  }));
}

function buildHeatmapData(recentlyPlayed: RecentlyPlayedTrack[]): HeatmapCell[] {
  const counts = new Map<string, number>();

  recentlyPlayed.forEach((item) => {
    const date = item.playedAt.slice(0, 10);
    counts.set(date, (counts.get(date) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function clusterFromFeatures(features: ReturnType<typeof getMockAudioFeatures>): string {
  if (features.energy > 65 && features.danceability > 55) return "High-energy";
  if (features.acousticness > 55) return "Acoustic";
  if (features.valence < 40) return "Moody";
  return "Feel-good";
}

function buildBeeswarmData(tracks: Track[]): BeeswarmPoint[] {
  return tracks.slice(0, 40).map((track) => {
    const features = getMockAudioFeatures(track);
    return {
      id: track.id,
      name: track.name,
      tempo: features.tempo,
      popularity: track.popularity,
      cluster: clusterFromFeatures(features)
    };
  });
}

function buildVoronoiData(artists: Artist[], tracks: Track[]): VoronoiCell[] {
  const counts = artistPlayCounts(tracks);

  return artists.slice(0, 16).map((artist, index) => {
    const angle = (index / 16) * Math.PI * 2;
    const radius = 0.25 + (index % 4) * 0.08;
    return {
      id: artist.id,
      name: artist.name,
      playCount: counts.get(artist.id) ?? artist.popularity,
      genre: primaryGenre(artist),
      x: 0.5 + Math.cos(angle) * radius,
      y: 0.5 + Math.sin(angle) * radius
    };
  });
}

export function buildChartData(data: SourceData): ChartData {
  const enrichedTracks = enrichTrackGenres(data.topTracks, data.topArtists);

  return {
    bubble: buildBubbleData(data.topArtists, enrichedTracks),
    radar: buildRadarData(data.topArtists),
    sankey: buildSankeyData(data.topArtists, enrichedTracks),
    chord: buildChordData(data.topArtists),
    streamgraph: buildStreamgraphData(data.recentlyPlayed, data.topArtists),
    heatmap: buildHeatmapData(data.recentlyPlayed),
    beeswarm: buildBeeswarmData(enrichedTracks),
    voronoi: buildVoronoiData(data.topArtists, enrichedTracks)
  };
}
