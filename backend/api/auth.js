const express = require('express')

const router = express.Router()

function setTokenCookies(res, data) {
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

router.post('/exchange', async (req, res) => {
  try {
    const { code, code_verifier } = req.body
    if (!code) return res.status(400).json({ error: 'Missing code' })

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      client_id: process.env.SPOTIFY_CLIENT_ID,
      code_verifier: code_verifier || ''
    })

    if (process.env.SPOTIFY_CLIENT_SECRET) {
      body.set('client_secret', process.env.SPOTIFY_CLIENT_SECRET)
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    })

    const data = await response.json()
    if (!response.ok) return res.status(response.status).json(data)

    setTokenCookies(res, data)
    return res.json({ ok: true })
  } catch (error) {
    console.error('Auth exchange failed:', error)
    return res.status(500).json({ error: 'Exchange failed' })
  }
})

router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies?.spotify_refresh_token
    if (!refreshToken) return res.status(401).json({ error: 'No refresh token' })

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.SPOTIFY_CLIENT_ID
    })

    if (process.env.SPOTIFY_CLIENT_SECRET) {
      body.set('client_secret', process.env.SPOTIFY_CLIENT_SECRET)
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    })

    const data = await response.json()
    if (!response.ok) return res.status(response.status).json(data)

    setTokenCookies(res, data)
    return res.json({ ok: true })
  } catch (error) {
    console.error('Auth refresh failed:', error)
    return res.status(500).json({ error: 'Refresh failed' })
  }
})

router.post('/logout', (req, res) => {
  res.clearCookie('spotify_access_token', { path: '/' })
  res.clearCookie('spotify_refresh_token', { path: '/' })
  return res.json({ ok: true })
})

module.exports = router