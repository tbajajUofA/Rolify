/**
 * Character generation router.
 *
 * Purpose:
 * - Accepts a requested time range from the frontend.
 * - Gathers Spotify data through the internal service layer.
 * - Builds a Gemini prompt and returns the generated personality profile.
 *
 * Frontend call sites:
 * - frontend/src/lib/spotify-api.ts -> generateCharacter()
 * - frontend/src/pages/CharacterSheetPage.tsx
 */
const express = require('express')
const { getAccessTokenFromRequest } = require('../services/spotify')
const { generateCharacterProfile } = require('../services/character')

const router = express.Router()

router.post('/generate', async (req, res) => {
  try {
    // The frontend can send the time range either in the body or query string.
    const accessToken = getAccessTokenFromRequest(req)
    const timeRange = req.body?.time_range || req.query?.time_range || 'medium_term'

    // This service does the orchestration: profile fetch, top tracks, artists, features, followed artists, playlists, Gemini.
    const profile = await generateCharacterProfile(accessToken, timeRange)
    return res.json(profile)
  } catch (error) {
    console.error('Character generation failed:', error)
    return res.status(error.status || 500).json({ error: error.message || 'Failed to generate personality profile' })
  }
})

module.exports = router