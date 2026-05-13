export type TimeRange = 'long_term' | 'medium_term' | 'short_term'

async function apiFetch(input: RequestInfo, init?: RequestInit, retry = true) {
  const res = await fetch(input, init)
  if (res.status === 401 && retry) {
    // try to refresh token
    try {
      const refresh = await fetch('/api/auth/refresh', { method: 'POST' })
      if (refresh.ok) {
        // retry original request once
        return apiFetch(input, init, false)
      }
    } catch (err) {
      // fallthrough to throw original error
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
  return apiFetch('/api/spotify/me').then((d: any) => d.user || d)
}

export async function getTopTracks(limit = 10, time_range: TimeRange = 'medium_term') {
  return apiFetch(`/api/spotify/top-tracks?limit=${limit}&time_range=${time_range}`).then((d: any) => d.tracks || d.items || d)
}

export async function getTopArtists(limit = 5, time_range: TimeRange = 'medium_term') {
  return apiFetch(`/api/spotify/top-artists?limit=${limit}&time_range=${time_range}`).then((d: any) => d.artists || d.items || d)
}

export async function getAudioFeatures(ids: string[], time_range: TimeRange = 'medium_term') {
  const query = ids.length ? `?ids=${ids.join(',')}&time_range=${time_range}` : `?time_range=${time_range}`
  return apiFetch(`/api/spotify/audio-features${query}`).then((d: any) => d.tracks || d.audio_features || d)
}

export async function getFollowedArtists() {
  return apiFetch('/api/spotify/followed-artists').then((d: any) => d.artists || d)
}

export async function getPlaylists() {
  return apiFetch('/api/spotify/playlists').then((d: any) => d.playlists || d)
}

export async function generateCharacter(time_range: TimeRange = 'medium_term') {
  return apiFetch('/api/character/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ time_range })
  })
}
