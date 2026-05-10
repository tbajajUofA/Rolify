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
  return apiFetch('/api/spotify/me')
}

export async function getTopTracks(limit = 50, time_range = 'medium_term') {
  return apiFetch(`/api/spotify/me/top/tracks?limit=${limit}&time_range=${time_range}`).then((d: any) => d.items || d)
}

export async function getTopArtists(limit = 20, time_range = 'medium_term') {
  return apiFetch(`/api/spotify/me/top/artists?limit=${limit}&time_range=${time_range}`).then((d: any) => d.items || d)
}

export async function getAudioFeatures(ids: string[]) {
  return apiFetch(`/api/spotify/audio-features?ids=${ids.join(',')}`).then((d: any) => d.audio_features || d)
}
