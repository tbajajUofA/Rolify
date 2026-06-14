import type { Artist, RecentlyPlayedTrack, TimeRange, Track } from "@/lib/types";

const SPOTIFY_API = "https://api.spotify.com/v1";

type SpotifyArtist = {
  id: string;
  name: string;
  genres?: string[];
  images?: { url: string; height: number | null; width: number | null }[];
  popularity?: number;
  external_urls?: { spotify?: string };
};

type SpotifyTrack = {
  id: string;
  name: string;
  popularity?: number;
  album?: { images?: { url: string; height: number | null; width: number | null }[] };
  artists?: SpotifyArtist[];
  external_urls?: { spotify?: string };
};

export type SpotifyProfile = {
  id: string;
  display_name: string | null;
  email: string | null;
  images?: { url: string }[];
};

async function spotifyFetch<T>(accessToken: string, path: string): Promise<T> {
  const response = await fetch(`${SPOTIFY_API}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Spotify request failed (${response.status}) for ${path}`);
  }

  return response.json() as Promise<T>;
}

function mapArtist(artist: SpotifyArtist): Artist {
  return {
    id: artist.id,
    name: artist.name,
    genres: artist.genres ?? [],
    images: artist.images ?? [],
    popularity: artist.popularity ?? 0,
    externalUrl: artist.external_urls?.spotify ?? ""
  };
}

function mapTrack(track: SpotifyTrack, artistGenreMap = new Map<string, string[]>()): Track {
  return {
    id: track.id,
    name: track.name,
    popularity: track.popularity ?? 0,
    albumArt: track.album?.images?.[0]?.url ?? "",
    externalUrl: track.external_urls?.spotify ?? "",
    artists: (track.artists ?? []).map((artist) => ({
      id: artist.id,
      name: artist.name,
      genres: artist.genres ?? artistGenreMap.get(artist.id) ?? []
    }))
  };
}

export async function getCurrentUserProfile(accessToken: string) {
  return spotifyFetch<SpotifyProfile>(accessToken, "/me");
}

export async function getTopArtists(
  accessToken: string,
  timeRange: TimeRange = "medium_term",
  limit = 50
) {
  const data = await spotifyFetch<{ items: SpotifyArtist[] }>(
    accessToken,
    `/me/top/artists?time_range=${timeRange}&limit=${limit}`
  );

  return data.items.map(mapArtist);
}

export async function getTopTracks(
  accessToken: string,
  timeRange: TimeRange = "medium_term",
  limit = 50
) {
  const data = await spotifyFetch<{ items: SpotifyTrack[] }>(
    accessToken,
    `/me/top/tracks?time_range=${timeRange}&limit=${limit}`
  );

  return data.items.map((track) => mapTrack(track));
}

export async function getRecentlyPlayed(accessToken: string, limit = 50) {
  const data = await spotifyFetch<{ items: { played_at: string; track: SpotifyTrack }[] }>(
    accessToken,
    `/me/player/recently-played?limit=${limit}`
  );

  return data.items.map<RecentlyPlayedTrack>((item) => ({
    playedAt: item.played_at,
    track: mapTrack(item.track)
  }));
}
