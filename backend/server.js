require('dotenv').config()
const express = require('express')
const fetch = global.fetch || require('node-fetch')
const cookieParser = require('cookie-parser')
const app = express()
app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT || 3000

app.get('/health', (req, res) => res.json({ ok: true }))

// Exchange authorization code for tokens
app.post('/api/auth/exchange', async (req, res) => {
  try {
    const { code, code_verifier } = req.body
    if (!code) return res.status(400).json({ error: 'Missing code' })

    // Use PKCE flow: send client_id and code_verifier (do NOT require client_secret)
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      client_id: process.env.SPOTIFY_CLIENT_ID,
      code_verifier: code_verifier || ''
    })

    const r = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    })

    const data = await r.json()
    if (!r.ok) return res.status(r.status).json(data)

    // Set HTTP-only cookies for access and refresh tokens
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
      // 30 days
      res.cookie('spotify_refresh_token', data.refresh_token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'lax',
        secure,
        path: '/'
      })
    }

    return res.json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Exchange failed' })
  }
})

// Simple proxy to Spotify Web API endpoints that require Authorization header
app.use('/api/spotify', async (req, res) => {
  try {
    // Read access token from httpOnly cookie (via cookie-parser) if present
    const token = req.cookies?.spotify_access_token || (req.headers.authorization || req.query.access_token)
    if (!token) return res.status(401).json({ error: 'Missing access token' })

    const path = req.originalUrl.replace('/api/spotify', '')
    const spotifyUrl = `https://api.spotify.com/v1${path}`
    const r = await fetch(spotifyUrl, {
      method: req.method,
      headers: { Authorization: `Bearer ${token.replace(/^Bearer\s*/i, '')}`, 'Content-Type': 'application/json' }
    })
    const data = await r.text()
    res.status(r.status).send(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Spotify proxy failed' })
  }
})

// Refresh access token using the stored refresh token
app.post('/api/auth/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies?.spotify_refresh_token
    if (!refreshToken) return res.status(401).json({ error: 'No refresh token' })

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.SPOTIFY_CLIENT_ID
    })

    const r = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    })
    const data = await r.json()
    if (!r.ok) return res.status(r.status).json(data)

    const expiresIn = Number(data.expires_in) || 3600
    const secure = process.env.NODE_ENV === 'production'
    res.cookie('spotify_access_token', data.access_token, { httpOnly: true, maxAge: expiresIn * 1000, sameSite: 'lax', secure, path: '/' })
    if (data.refresh_token) {
      res.cookie('spotify_refresh_token', data.refresh_token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000, sameSite: 'lax', secure, path: '/' })
    }
    return res.json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Refresh failed' })
  }
})

// Logout: clear cookies
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('spotify_access_token', { path: '/' })
  res.clearCookie('spotify_refresh_token', { path: '/' })
  return res.json({ ok: true })
})

// Gemini generate-character endpoint
app.post('/api/generate-character', async (req, res) => {
  try {
    const body = req.body
    const apiUrl = process.env.GEMINI_API_URL
    if (!apiUrl || !process.env.GEMINI_API_KEY) return res.status(500).json({ error: 'Gemini not configured' })

    const payload = {
      contents: [{ role: 'user', parts: [{ text: body.prompt || JSON.stringify(body) }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.9 }
    }

    const r = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
      body: JSON.stringify(payload)
    })

    const data = await r.json()
    // The API returns candidates[0].content.parts[0].text which is JSON
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (text) {
      try {
        return res.json(JSON.parse(text))
      } catch (err) {
        return res.status(200).json({ raw: text })
      }
    }
    return res.status(502).json({ error: 'Malformed response from Gemini', raw: data })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Gemini request failed' })
  }
})

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`))
