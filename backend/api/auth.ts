/**
 * Auth router.
 *
 * Purpose:
 * - Exchanges the Spotify authorization code for access and refresh tokens.
 * - Refreshes access tokens using the stored refresh token.
 * - Clears auth cookies on logout.
 *
 * Frontend call sites:
 * - frontend/src/lib/spotify-auth.ts -> handleSpotifyCallback()
 * - frontend/src/lib/spotify-auth.ts -> logout()
 * - frontend/src/pages/CallbackPage.tsx -> callback redirect handler
 */
import express, { Request, Response } from 'express'

interface SpotifyTokenResponse {
  access_token: string
  token_type?: string
  scope?: string
  expires_in?: number
  refresh_token?: string
}

const router = express.Router()

// Store Spotify tokens in httpOnly cookies so the browser cannot read them.
function setTokenCookies(res: Response, data: SpotifyTokenResponse) {
  const expiresIn = Number(data.expires_in) || 3600
  const secure = process.env.NODE_ENV === 'production'

  res.cookie('spotify_access_token', data.access_token, {
    httpOnly: true,
    maxAge: expiresIn * 1000,
    sameSite: 'lax',
    secure,
    path: '/'
  })

  if (data.refresh_token) {
    res.cookie('spotify_refresh_token', data.refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      secure,
      path: '/'
    })
  }
}

router.post('/exchange', async (req: Request, res: Response) => {
  try {
    // The frontend sends the OAuth code plus PKCE verifier.
    const { code, code_verifier } = req.body as { code?: string; code_verifier?: string }
    if (!code) return res.status(400).json({ error: 'Missing code' })

    // Build the Spotify token exchange request.
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI || '',
      client_id: process.env.SPOTIFY_CLIENT_ID || '',
      code_verifier: code_verifier || ''
    })

    // Some environments still provide a client secret. Keep the request flexible.
    if (process.env.SPOTIFY_CLIENT_SECRET) {
      body.set('client_secret', process.env.SPOTIFY_CLIENT_SECRET)
    }

    // Call Spotify Accounts API to swap the code for tokens.
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    })

    const data = (await response.json()) as SpotifyTokenResponse | Record<string, unknown>
    if (!response.ok) return res.status(response.status).json(data)

    // Persist the returned tokens as cookies and confirm success to the frontend.
    setTokenCookies(res, data as SpotifyTokenResponse)
    return res.json({ ok: true })
  } catch (error) {
    console.error('Auth exchange failed:', error)
    return res.status(500).json({ error: 'Exchange failed' })
  }
})

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    // Refresh uses the cookie that was set during the exchange step.
    const refreshToken = req.cookies?.spotify_refresh_token as string | undefined
    if (!refreshToken) return res.status(401).json({ error: 'No refresh token' })

    // Ask Spotify Accounts API for a fresh access token.
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.SPOTIFY_CLIENT_ID || ''
    })

    if (process.env.SPOTIFY_CLIENT_SECRET) {
      body.set('client_secret', process.env.SPOTIFY_CLIENT_SECRET)
    }

    // Reuse the same cookie helper so token storage stays consistent.
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    })

    const data = (await response.json()) as SpotifyTokenResponse | Record<string, unknown>
    if (!response.ok) return res.status(response.status).json(data)

    setTokenCookies(res, data as SpotifyTokenResponse)
    return res.json({ ok: true })
  } catch (error) {
    console.error('Auth refresh failed:', error)
    return res.status(500).json({ error: 'Refresh failed' })
  }
})

router.post('/logout', (_req: Request, res: Response) => {
  // Clearing cookies is enough because auth state is stored only there.
  res.clearCookie('spotify_access_token', { path: '/' })
  res.clearCookie('spotify_refresh_token', { path: '/' })
  return res.json({ ok: true })
})

export default router
