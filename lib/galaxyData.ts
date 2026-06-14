import { clusterTracks } from "@/lib/clusters";
import { getMockAudioFeatures } from "@/lib/mockAudioFeatures";
import type {
  Artist,
  AudioFeatures,
  GenreCount,
  RecentlyPlayedTrack,
  Track,
  TrajectoryPoint,
  VisualTrack
} from "@/lib/types";

type SourceData = {
  topArtistsShort: Artist[];
  topArtistsLong: Artist[];
  topTracksShort: Track[];
  topTracksLong: Track[];
  recentlyPlayed: RecentlyPlayedTrack[];
};

const EMPTY_FEATURES: AudioFeatures = {
  energy: 0,
  valence: 0,
  danceability: 0,
  acousticness: 0,
  tempo: 0
};

function enrichTrackGenres(tracks: Track[], artists: Artist[]) {
  const genreByArtist = new Map(artists.map((artist) => [artist.id, artist.genres]));

  return tracks.map((track) => ({
    ...track,
    artists: track.artists.map((artist) => ({
      ...artist,
      genres: artist.genres.length > 0 ? artist.genres : genreByArtist.get(artist.id) ?? []
    }))
  }));
}

function averageFeatures(tracks: VisualTrack[]): AudioFeatures {
  if (tracks.length === 0) {
    return EMPTY_FEATURES;
  }

  const total = tracks.reduce<AudioFeatures>(
    (sum, track) => ({
      energy: sum.energy + track.features.energy,
      valence: sum.valence + track.features.valence,
      danceability: sum.danceability + track.features.danceability,
      acousticness: sum.acousticness + track.features.acousticness,
      tempo: sum.tempo + track.features.tempo
    }),
    EMPTY_FEATURES
  );

  return {
    energy: Math.round(total.energy / tracks.length),
    valence: Math.round(total.valence / tracks.length),
    danceability: Math.round(total.danceability / tracks.length),
    acousticness: Math.round(total.acousticness / tracks.length),
    tempo: Math.round(total.tempo / tracks.length)
  };
}

function genreDistribution(artists: Artist[]): GenreCount[] {
  const counts = new Map<string, number>();

  artists.forEach((artist) => {
    artist.genres.forEach((genre) => {
      counts.set(genre, (counts.get(genre) ?? 0) + 1);
    });
  });

  const total = Array.from(counts.values()).reduce((sum, count) => sum + count, 0) || 1;

  return Array.from(counts.entries())
    .map(([genre, count]) => ({
      genre,
      count,
      percentage: Math.round((count / total) * 100)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);
}

function findRedGiants(longTracks: Track[], shortTracks: Track[]) {
  const shortArtistIds = new Set(shortTracks.flatMap((track) => track.artists.map((artist) => artist.id)));
  const longArtists = new Map<string, Track["artists"][number]>();

  longTracks.forEach((track) => {
    track.artists.forEach((artist) => {
      if (!shortArtistIds.has(artist.id)) {
        longArtists.set(artist.id, artist);
      }
    });
  });

  return Array.from(longArtists.values()).slice(0, 6);
}

function findSupernova(shortArtists: Artist[], longArtists: Artist[]) {
  const longRank = new Map(longArtists.map((artist, index) => [artist.id, index + 1]));

  return (
    shortArtists
      .map((artist, index) => ({
        artist,
        jump: (longRank.get(artist.id) ?? shortArtists.length + longArtists.length) - (index + 1)
      }))
      .sort((a, b) => b.jump - a.jump)[0]?.artist ?? shortArtists[0] ?? longArtists[0]
  );
}

function recentlyPlayedByDay(recentlyPlayed: RecentlyPlayedTrack[]): TrajectoryPoint[] {
  const counts = new Map<string, number>();

  recentlyPlayed.forEach((item) => {
    const day = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(
      new Date(item.playedAt)
    );
    counts.set(day, (counts.get(day) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([day, count]) => ({ day, count }))
    .reverse();
}

export function buildGalaxyData(data: SourceData) {
  const allArtists = [...data.topArtistsShort, ...data.topArtistsLong];
  const enrichedLongTracks = enrichTrackGenres(data.topTracksLong, allArtists);
  const tracksWithFeatures = enrichedLongTracks.map((track) => ({
    ...track,
    features: getMockAudioFeatures(track)
  }));
  const tracks = clusterTracks(tracksWithFeatures);
  const genres = genreDistribution(allArtists);

  return {
    tracks,
    topArtistsLong: data.topArtistsLong.slice(0, 12),
    artistConstellations: data.topArtistsLong.slice(0, 24),
    genreDistribution: genres,
    topGenres: genres.slice(0, 14),
    redGiants: findRedGiants(data.topTracksLong, data.topTracksShort),
    supernova: findSupernova(data.topArtistsShort, data.topArtistsLong),
    averageFeatures: averageFeatures(tracks),
    recentlyPlayedByDay: recentlyPlayedByDay(data.recentlyPlayed),
    grandFinale: tracks[0]
  };
}
