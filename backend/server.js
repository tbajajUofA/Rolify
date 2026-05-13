/**
 * Entry point for the backend HTTP server.
 *
 * Purpose:
 * - Loads environment variables.
 * - Creates the Express app.
 * - Mounts the public API routers under /api.
 * - Exposes /health for a lightweight liveness check.
 *
 * Cross references:
 * - Frontend login flow: frontend/src/lib/spotify-auth.ts
 * - Callback landing page: frontend/src/pages/CallbackPage.tsx
 * - Character profile request: frontend/src/pages/CharacterSheetPage.tsx
 * - Frontend API wrapper: frontend/src/lib/spotify-api.ts
 */
require('dotenv').config()

const express = require('express')
const cookieParser = require('cookie-parser')

// Public route modules. These files hold the HTTP endpoints the frontend calls.
const authRouter = require('./api/auth')
const spotifyRouter = require('./api/spotify')
const characterRouter = require('./api/character')

const app = express()
const PORT = process.env.PORT || 3000

// Shared middleware used by all route handlers.
app.use(express.json())
app.use(cookieParser())

// Simple health check for local dev and deployment probes.
app.get('/health', (req, res) => res.json({ ok: true }))

// Mount auth endpoints such as token exchange, refresh, and logout.
app.use('/api/auth', authRouter)
// Mount Spotify data endpoints used by the app and by character generation.
app.use('/api/spotify', spotifyRouter)
// Mount the Gemini-backed character generation endpoint.
app.use('/api/character', characterRouter)

// Start the HTTP server.
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`))
