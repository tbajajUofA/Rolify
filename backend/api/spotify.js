/**
 * Spotify data router.
 *
 * Purpose:
 * - Exposes a stable HTTP API for the frontend.
 * - Hides direct Spotify Web API calls behind the backend.
 * - Normalizes response shapes so the frontend does not need Spotify-specific parsing logic.
 *
 * Frontend call sites:
 * - frontend/src/lib/spotify-api.ts
 * - frontend/src/pages/CharacterSheetPage.tsx (through generateCharacter())
 *
 * Notes:
 * - time_range is supported on the top tracks and top artists endpoints.
 * - The backend reads the Spotify access token from cookies or headers.
 */
const express = require('express')
const {
  getAccessTokenFromRequest,
  getUserProfile,
  getTopTracks,
  getTopArtists,
  getAudioFeatures,
  getFollowedArtists,
  getPlaylists
} = require('../services/spotify')

const router = express.Router()

// Convert low-level service errors into consistent JSON responses.
function handleApiError(res, error, fallbackMessage) {
  console.error(fallbackMessage, error)
  return res.status(error.status || 500).json({ error: error.message || fallbackMessage })
}

router.get('/me', async (req, res) => {
  try {
    // GET /api/spotify/me -> Spotify Web API GET /v1/me.
    const accessToken = getAccessTokenFromRequest(req)
    const user = await getUserProfile(accessToken)
    return res.json({ user })
  } catch (error) {
    return handleApiError(res, error, 'Failed to fetch Spotify profile')
  }
})

router.get('/top-tracks', async (req, res) => {
  try {
    // GET /api/spotify/top-tracks -> Spotify Web API GET /v1/me/top/tracks.
    // The frontend uses this endpoint when building the character profile and for debugging.
    const accessToken = getAccessTokenFromRequest(req)
    const timeRange = req.query.time_range || 'medium_term'
    const limit = Number(req.query.limit) || 10
    const result = await getTopTracks(accessToken, { time_range: timeRange, limit })
    return res.json(result)
  } catch (error) {
    return handleApiError(res, error, 'Failed to fetch top tracks')
  }
})

router.get('/top-artists', async (req, res) => {
  try {
    // GET /api/spotify/top-artists -> Spotify Web API GET /v1/me/top/artists.
    const accessToken = getAccessTokenFromRequest(req)
    const timeRange = req.query.time_range || 'medium_term'
    const limit = Number(req.query.limit) || 5
    const result = await getTopArtists(accessToken, { time_range: timeRange, limit })
    return res.json(result)
  } catch (error) {
    return handleApiError(res, error, 'Failed to fetch top artists')
  }
})

router.get('/audio-features', async (req, res) => {
  try {
    // GET /api/spotify/audio-features -> Spotify Web API GET /v1/audio-features.
    // If ids are omitted, the service derives them from the user's top tracks.
    const accessToken = getAccessTokenFromRequest(req)
    const timeRange = req.query.time_range || 'medium_term'
    const ids = String(req.query.ids || '')
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean)
    const result = await getAudioFeatures(accessToken, { ids, time_range: timeRange, limit: Number(req.query.limit) || 10 })
    return res.json(result)
  } catch (error) {
    return handleApiError(res, error, 'Failed to fetch audio features')
  }
})

router.get('/followed-artists', async (req, res) => {
  try {
    // GET /api/spotify/followed-artists -> Spotify Web API GET /v1/me/following?type=artist.
    const accessToken = getAccessTokenFromRequest(req)
    const result = await getFollowedArtists(accessToken)
    return res.json(result)
  } catch (error) {
    return handleApiError(res, error, 'Failed to fetch followed artists')
  }
})

router.get('/playlists', async (req, res) => {
  try {
    // GET /api/spotify/playlists -> Spotify Web API GET /v1/me/playlists.
    const accessToken = getAccessTokenFromRequest(req)
    const result = await getPlaylists(accessToken)
    return res.json(result)
  } catch (error) {
    return handleApiError(res, error, 'Failed to fetch playlists')
  }
})

module.exports = router