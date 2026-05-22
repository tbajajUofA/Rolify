/**
 * Frontend API wrapper for backend HTTP endpoints.
 *
 * Purpose:
 * - Keeps the UI code away from direct fetch calls to Spotify.
 * - Uses the backend as the single source of truth for Spotify and Gemini data.
 * - Automatically retries once after a 401 by calling backend/api/auth.ts -> /api/auth/refresh.
 *
 * Cross references:
 * - backend/api/auth.ts for token refresh
 * - backend/api/spotify.ts for Spotify data endpoints
 * - backend/api/character.ts for generated profile responses
 * - src/pages/CharacterSheetPage.tsx for the consumer UI
 */
export type TimeRange = 'long_term' | 'medium_term' | 'short_term'

async function apiFetch(input: RequestInfo, init?: RequestInit, retry = true) {
  // Shared fetch helper with a single refresh retry on 401.
  const res = await fetch(input, init)
  if (res.status === 401 && retry) {
    // Try to refresh the server cookie token once, then retry the original request.
    try {
      const refresh = await fetch('/api/auth/refresh', { method: 'POST' })
      if (refresh.ok) {
        // Retry original request once after refreshing.
        return apiFetch(input, init, false)
      }
    } catch (err) {
      // Fall through to the original error handling.
    }
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    const err = new Error(text || `Request failed: ${res.status}`)
    ;(err as any).status = res.status
    throw err
  }
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json()
  return res.text()
}

export async function getUserProfile() {
  // backend/api/spotify.ts -> GET /api/spotify/me
  return apiFetch('/api/spotify/me').then((d: any) => d.user || d)
}

export async function getTopTracks(limit = 10, time_range: TimeRange = 'medium_term') {
  // backend/api/spotify.ts -> GET /api/spotify/top-tracks
  return apiFetch(`/api/spotify/top-tracks?limit=${limit}&time_range=${time_range}`).then((d: any) => d.tracks || d.items || d)
}

export async function getTopArtists(limit = 5, time_range: TimeRange = 'medium_term') {
  // backend/api/spotify.ts -> GET /api/spotify/top-artists
  return apiFetch(`/api/spotify/top-artists?limit=${limit}&time_range=${time_range}`).then((d: any) => d.artists || d.items || d)
}

export async function getAudioFeatures(ids: string[], time_range: TimeRange = 'medium_term') {
  // backend/api/spotify.ts -> GET /api/spotify/audio-features
  const query = ids.length ? `?ids=${ids.join(',')}&time_range=${time_range}` : `?time_range=${time_range}`
  return apiFetch(`/api/spotify/audio-features${query}`).then((d: any) => d.tracks || d.audio_features || d)
}

export async function getFollowedArtists() {
  // backend/api/spotify.ts -> GET /api/spotify/followed-artists
  return apiFetch('/api/spotify/followed-artists').then((d: any) => d.artists || d)
}

export async function getPlaylists() {
  // backend/api/spotify.ts -> GET /api/spotify/playlists
  return apiFetch('/api/spotify/playlists').then((d: any) => d.playlists || d)
}

export async function generateCharacter(time_range: TimeRange = 'medium_term') {
  // backend/api/character.ts -> POST /api/character/generate
  return apiFetch('/api/character/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ time_range })
  })
}
