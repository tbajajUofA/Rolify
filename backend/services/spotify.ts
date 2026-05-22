/**
 * Internal Spotify service helpers.
 *
 * Purpose:
 * - Wrap low-level fetch calls to the Spotify Web API.
 * - Normalize Spotify responses into shapes that are easier for the app to consume.
 * - Keep Spotify-specific URL and token handling out of the HTTP route files.
 *
 * This file is not called directly by the frontend. The frontend talks to
 * backend/api/spotify.ts and backend/api/character.ts instead.
 */
import { Request } from 'express'

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'

export interface AppError extends Error {
  status?: number
  payload?: unknown
}

export interface UserProfile {
  id: string
  display_name?: string
  email?: string
}

export interface TrackSummary {
  id: string
  name: string
  artists: Array<{ id: string; name: string }>
  album: { id: string; name: string; images: Array<{ url: string; height?: number; width?: number }> } | null
  popularity?: number
}

export interface ArtistSummary {
  id: string
  name: string
  genres: string[]
  popularity?: number
  followers: number
  images: Array<{ url: string; height?: number; width?: number }>
}

export interface AudioFeatureSummary {
  id: string
  energy: number
  valence: number
  danceability: number
  acousticness: number
  instrumentalness: number
  speechiness: number
  tempo: number
}

export interface TopTracksResult {
  time_range: string
  tracks: TrackSummary[]
}

export interface TopArtistsResult {
  time_range: string
  artists: ArtistSummary[]
}

export interface AudioFeaturesResult {
  time_range: string
  tracks: AudioFeatureSummary[]
  averages: Record<string, number> | null
}

export interface FollowedArtistsResult {
  artists: Array<{ id: string; name: string; genres: string[] }>
}

export interface PlaylistsResult {
  playlists: string[]
}

// Accept either a raw token or a `Bearer ...` header value.
function stripBearer(token: string | undefined) {
  return String(token || '').replace(/^Bearer\s*/i, '').trim()
}

// Pull the token from cookies first, then Authorization header, then query string.
export function getAccessTokenFromRequest(req: Request) {
  const headerToken = String(req.headers.authorization || '')
  const queryToken = String(req.query?.access_token || '')
  return req.cookies?.spotify_access_token || stripBearer(headerToken) || stripBearer(queryToken)
}

// Shared request helper for all Spotify API calls.
export async function spotifyRequest<T = unknown>(
  endpoint: string,
  { accessToken, query = {}, method = 'GET', body }: { accessToken?: string; query?: Record<string, unknown>; method?: string; body?: unknown } = {}
): Promise<T> {
  const token = stripBearer(accessToken)
  if (!token) {
    const error: AppError = new Error('Missing access token')
    error.status = 401
    throw error
  }

  // Build the final Spotify URL with any query parameters.
  const url = new URL(`${SPOTIFY_API_BASE}${endpoint}`)
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  }

  // Spotify requests use bearer auth and JSON bodies when needed.
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  })

  // Parse either JSON or plain text so error handling can surface useful details.
  const contentType = response.headers.get('content-type') || ''
  const payload: unknown = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    const source = payload as { error?: { message?: string } | string }
    const message =
      (typeof source?.error === 'string' && source.error) ||
      (typeof source?.error === 'object' && source.error?.message) ||
      `Spotify request failed with status ${response.status}`
    const error: AppError = new Error(message)
    error.status = response.status
    error.payload = payload
    throw error
  }

  return payload as T
}

export async function getUserProfile(accessToken?: string): Promise<UserProfile> {
  // Spotify endpoint: GET /v1/me
  return spotifyRequest<UserProfile>('/me', { accessToken })
}

export async function getTopTracks(
  accessToken?: string,
  { time_range = 'medium_term', limit = 10 }: { time_range?: string; limit?: number } = {}
): Promise<TopTracksResult> {
  // Spotify endpoint: GET /v1/me/top/tracks
  const data = await spotifyRequest<{ items?: Array<Record<string, any>> }>('/me/top/tracks', {
    accessToken,
    query: { time_range, limit, offset: 0 }
  })

  // Normalize the raw Spotify response so the frontend and character service can read it consistently.
  return {
    time_range,
    tracks: (data.items || []).map((track) => ({
      id: String(track.id),
      name: String(track.name),
      artists: (track.artists || []).map((artist: Record<string, any>) => ({ id: String(artist.id), name: String(artist.name) })),
      album: track.album
        ? {
            id: String(track.album.id),
            name: String(track.album.name),
            images: Array.isArray(track.album.images) ? track.album.images : []
          }
        : null,
      popularity: typeof track.popularity === 'number' ? track.popularity : undefined
    }))
  }
}

export async function getTopArtists(
  accessToken?: string,
  { time_range = 'medium_term', limit = 5 }: { time_range?: string; limit?: number } = {}
): Promise<TopArtistsResult> {
  // Spotify endpoint: GET /v1/me/top/artists
  const data = await spotifyRequest<{ items?: Array<Record<string, any>> }>('/me/top/artists', {
    accessToken,
    query: { time_range, limit, offset: 0 }
  })

  return {
    time_range,
    artists: (data.items || []).map((artist) => ({
      id: String(artist.id),
      name: String(artist.name),
      genres: Array.isArray(artist.genres) ? artist.genres.map(String) : [],
      popularity: typeof artist.popularity === 'number' ? artist.popularity : undefined,
      followers: Number(artist.followers?.total || 0),
      images: Array.isArray(artist.images) ? artist.images : []
    }))
  }
}

export async function getAudioFeatures(
  accessToken?: string,
  { ids = [], time_range = 'medium_term', limit = 10 }: { ids?: string[]; time_range?: string; limit?: number } = {}
): Promise<AudioFeaturesResult> {
  // If the caller does not provide track IDs, derive them from the user's top tracks.
  let trackIds = ids.filter(Boolean)

  if (!trackIds.length) {
    const topTracks = await getTopTracks(accessToken, { time_range, limit })
    trackIds = topTracks.tracks.map((track) => track.id).filter(Boolean)
  }

  if (!trackIds.length) {
    return { time_range, tracks: [], averages: null }
  }

  // Spotify endpoint: GET /v1/audio-features?ids=...
  const data = await spotifyRequest<{ audio_features?: Array<Record<string, any>> }>('/audio-features', {
    accessToken,
    query: { ids: trackIds.join(',') }
  })

  const tracks: AudioFeatureSummary[] = (data.audio_features || [])
    .filter(Boolean)
    .map((feature) => ({
      id: String(feature.id),
      energy: Number(feature.energy || 0),
      valence: Number(feature.valence || 0),
      danceability: Number(feature.danceability || 0),
      acousticness: Number(feature.acousticness || 0),
      instrumentalness: Number(feature.instrumentalness || 0),
      speechiness: Number(feature.speechiness || 0),
      tempo: Number(feature.tempo || 0)
    }))

  // Compute averages so the character layer can reference one summary object.
  const numericFields: Array<keyof Omit<AudioFeatureSummary, 'id'>> = [
    'energy',
    'valence',
    'danceability',
    'acousticness',
    'instrumentalness',
    'speechiness',
    'tempo'
  ]
  const averages = tracks.length
    ? Object.fromEntries(
        numericFields.map((field) => [
          field,
          Number((tracks.reduce((sum, track) => sum + (Number(track[field]) || 0), 0) / tracks.length).toFixed(field === 'tempo' ? 0 : 3))
        ])
      )
    : null

  return { time_range, tracks, averages }
}

export async function getFollowedArtists(accessToken?: string): Promise<FollowedArtistsResult> {
  // Spotify endpoint: GET /v1/me/following?type=artist
  const data = await spotifyRequest<{ artists?: { items?: Array<Record<string, any>> } }>('/me/following', {
    accessToken,
    query: { type: 'artist', limit: 20 }
  })

  return {
    artists: (data.artists?.items || []).map((artist) => ({
      id: String(artist.id),
      name: String(artist.name),
      genres: Array.isArray(artist.genres) ? artist.genres.map(String) : []
    }))
  }
}

export async function getPlaylists(accessToken?: string): Promise<PlaylistsResult> {
  // Spotify endpoint: GET /v1/me/playlists
  const data = await spotifyRequest<{ items?: Array<Record<string, any>> }>('/me/playlists', {
    accessToken,
    query: { limit: 50, offset: 0 }
  })

  return {
    playlists: (data.items || []).map((playlist) => String(playlist.name)).filter(Boolean)
  }
}
