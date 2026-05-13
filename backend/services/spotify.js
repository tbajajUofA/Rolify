/**
 * Internal Spotify service helpers.
 *
 * Purpose:
 * - Wrap low-level fetch calls to the Spotify Web API.
 * - Normalize Spotify responses into shapes that are easier for the app to consume.
 * - Keep Spotify-specific URL and token handling out of the HTTP route files.
 *
 * This file is not called directly by the frontend. The frontend talks to
 * backend/api/spotify.js and backend/api/character.js instead.
 */
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'

// Accept either a raw token or a `Bearer ...` header value.
function stripBearer(token) {
  return String(token || '').replace(/^Bearer\s*/i, '').trim()
}

// Pull the token from cookies first, then Authorization header, then query string.
function getAccessTokenFromRequest(req) {
  const headerToken = req.headers.authorization || ''
  const queryToken = req.query?.access_token || ''
  return req.cookies?.spotify_access_token || stripBearer(headerToken) || stripBearer(queryToken)
}

// Shared request helper for all Spotify API calls.
async function spotifyRequest(endpoint, { accessToken, query = {}, method = 'GET', body } = {}) {
  const token = stripBearer(accessToken)
  if (!token) {
    const error = new Error('Missing access token')
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
  const payload = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    const error = new Error(payload?.error?.message || payload?.error || `Spotify request failed with status ${response.status}`)
    error.status = response.status
    error.payload = payload
    throw error
  }

  return payload
}

async function getUserProfile(accessToken) {
  // Spotify endpoint: GET /v1/me
  return spotifyRequest('/me', { accessToken })
}

async function getTopTracks(accessToken, { time_range = 'medium_term', limit = 10 } = {}) {
  // Spotify endpoint: GET /v1/me/top/tracks
  const data = await spotifyRequest('/me/top/tracks', {
    accessToken,
    query: { time_range, limit, offset: 0 }
  })

  // Normalize the raw Spotify response so the frontend and character service can read it consistently.
  return {
    time_range,
    tracks: (data.items || []).map((track) => ({
      id: track.id,
      name: track.name,
      artists: (track.artists || []).map((artist) => ({ id: artist.id, name: artist.name })),
      album: track.album
        ? {
            id: track.album.id,
            name: track.album.name,
            images: track.album.images || []
          }
        : null,
      popularity: track.popularity
    }))
  }
}

async function getTopArtists(accessToken, { time_range = 'medium_term', limit = 5 } = {}) {
  // Spotify endpoint: GET /v1/me/top/artists
  const data = await spotifyRequest('/me/top/artists', {
    accessToken,
    query: { time_range, limit, offset: 0 }
  })

  return {
    time_range,
    artists: (data.items || []).map((artist) => ({
      id: artist.id,
      name: artist.name,
      genres: artist.genres || [],
      popularity: artist.popularity,
      followers: artist.followers?.total || 0,
      images: artist.images || []
    }))
  }
}

async function getAudioFeatures(accessToken, { ids = [], time_range = 'medium_term', limit = 10 } = {}) {
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
  const data = await spotifyRequest('/audio-features', {
    accessToken,
    query: { ids: trackIds.join(',') }
  })

  const tracks = (data.audio_features || [])
    .filter(Boolean)
    .map((feature) => ({
      id: feature.id,
      energy: feature.energy,
      valence: feature.valence,
      danceability: feature.danceability,
      acousticness: feature.acousticness,
      instrumentalness: feature.instrumentalness,
      speechiness: feature.speechiness,
      tempo: feature.tempo
    }))

  // Compute averages so the character layer can reference one summary object.
  const numericFields = ['energy', 'valence', 'danceability', 'acousticness', 'instrumentalness', 'speechiness', 'tempo']
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

async function getFollowedArtists(accessToken) {
  // Spotify endpoint: GET /v1/me/following?type=artist
  const data = await spotifyRequest('/me/following', {
    accessToken,
    query: { type: 'artist', limit: 20 }
  })

  return {
    artists: (data.artists?.items || []).map((artist) => ({
      id: artist.id,
      name: artist.name,
      genres: artist.genres || []
    }))
  }
}

async function getPlaylists(accessToken) {
  // Spotify endpoint: GET /v1/me/playlists
  const data = await spotifyRequest('/me/playlists', {
    accessToken,
    query: { limit: 50, offset: 0 }
  })

  return {
    playlists: (data.items || []).map((playlist) => playlist.name).filter(Boolean)
  }
}

module.exports = {
  getAccessTokenFromRequest,
  spotifyRequest,
  getUserProfile,
  getTopTracks,
  getTopArtists,
  getAudioFeatures,
  getFollowedArtists,
  getPlaylists
}