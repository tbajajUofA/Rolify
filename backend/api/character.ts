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
import express, { Request, Response } from 'express'
import { AppError, getAccessTokenFromRequest } from '../services/spotify'
import { generateCharacterProfile } from '../services/character'

const router = express.Router()

router.post('/generate', async (req: Request, res: Response) => {
  try {
    // The frontend can send the time range either in the body or query string.
    const accessToken = getAccessTokenFromRequest(req)
    const timeRange = String(req.body?.time_range || req.query?.time_range || 'medium_term')

    // This service does the orchestration: profile fetch, top tracks, artists, features, followed artists, playlists, Gemini.
    const profile = await generateCharacterProfile(accessToken, timeRange)
    return res.json(profile)
  } catch (error) {
    console.error('Character generation failed:', error)
    const appError = error as AppError
    return res.status(appError.status || 500).json({ error: appError.message || 'Failed to generate personality profile' })
  }
})

export default router
