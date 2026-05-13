/**
 * OAuth callback page.
 *
 * Purpose:
 * - Reads the authorization code returned by Spotify.
 * - Sends the code to backend/api/auth.js via src/lib/spotify-auth.ts.
 * - Redirects to the character page after the backend stores tokens.
 *
 * Cross references:
 * - Backend exchange endpoint: backend/api/auth.js
 * - OAuth helper: src/lib/spotify-auth.ts -> handleSpotifyCallback()
 */
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleSpotifyCallback } from '@/lib/spotify-auth'

export default function CallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Spotify returns ?code=... after the user grants access.
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (!code) {
      setError('No code in callback')
      return
    }

    ;(async () => {
      try {
        // Exchange the authorization code for server-stored tokens.
        await handleSpotifyCallback(code)
        navigate('/character')
      } catch (err: any) {
        console.error(err)
        setError(err?.message || String(err))
      }
    })()
  }, [navigate])

  return (
    <main className="p-8">
      <h2 className="text-xl">Callback</h2>
      {error ? <p className="text-red-400">{error}</p> : <p>Processing...</p>}
    </main>
  )
}
