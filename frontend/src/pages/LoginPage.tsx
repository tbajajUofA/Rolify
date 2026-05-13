/**
 * Login page.
 *
 * Purpose:
 * - Starts the Spotify OAuth flow.
 * - Provides demo shortcuts for local exploration.
 *
 * Cross references:
 * - OAuth start: src/lib/spotify-auth.ts -> redirectToSpotifyAuth()
 * - Demo content: src/lib/demo-data.ts
 * - Next page after login: src/pages/CallbackPage.tsx
 */
import React from 'react'
import { redirectToSpotifyAuth, isSpotifyConfigured } from '@/lib/spotify-auth'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()

  async function handleLogin() {
    try {
      await redirectToSpotifyAuth()
    } catch (err) {
      console.error(err)
      alert('Spotify configuration missing. Check .env and VITE_SPOTIFY_CLIENT_ID')
    }
  }

  function tryDemo(id: string) {
    // Demo mode bypasses Spotify and jumps straight to the character page.
    localStorage.setItem('demo_mode', 'true')
    localStorage.setItem('demo_profile_id', id)
    navigate('/character')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-xl w-full p-8 bg-slate-900/60 backdrop-blur rounded-lg border border-slate-700">
        <h1 className="text-4xl font-bold">Spotify RPG</h1>
        <p className="mt-2 text-slate-300">Transform your listening history into a playable RPG character.</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={handleLogin} className="px-4 py-2 bg-green-600 rounded text-black font-semibold">Login with Spotify</button>
          <button onClick={() => tryDemo('carti')} className="px-4 py-2 bg-slate-600 rounded">Demo: Carti</button>
          <button onClick={() => tryDemo('sabrina')} className="px-4 py-2 bg-slate-600 rounded">Demo: Sabrina</button>
          <button onClick={() => tryDemo('tyler')} className="px-4 py-2 bg-slate-600 rounded">Demo: Tyler</button>
          <button onClick={() => tryDemo('weeknd')} className="px-4 py-2 bg-slate-600 rounded">Demo: Weeknd</button>
        </div>

        {!isSpotifyConfigured() && <p className="mt-4 text-yellow-300">VITE_SPOTIFY_CLIENT_ID not set — demo mode only.</p>}
      </div>
    </main>
  )
}
