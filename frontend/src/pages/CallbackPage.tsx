/**
 * OAuth callback page.
 *
 * Purpose:
 * - Reads the authorization code returned by Spotify.
 * - Sends the code to backend/api/auth.ts via src/lib/spotify-auth.ts.
 * - Redirects to the character page after the backend stores tokens.
 *
 * Cross references:
 * - Backend exchange endpoint: backend/api/auth.ts
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
    <main className="app-shell grid min-h-screen place-items-center px-6 py-12 text-slate-100">
      <div className="orb left-1/2 top-[-7rem] h-80 w-80 -translate-x-1/2 bg-cyan-400/25" />
      <section className="glass-panel relative w-full max-w-xl rounded-[2rem] p-8 text-center">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-emerald-300/40 bg-emerald-300/10">
          {error ? (
            <span className="text-4xl font-black text-red-300">!</span>
          ) : (
            <div className="h-14 w-14 rounded-full border-4 border-emerald-300/20 border-t-emerald-300" style={{ animation: 'slow-spin 1.1s linear infinite' }} />
          )}
        </div>

        <p className="rune-label mt-8 text-xs">{error ? 'Ritual interrupted' : 'Spotify portal open'}</p>
        <h1 className="mt-4 text-4xl font-black text-white">
          {error ? 'The forge rejected the token.' : 'Forging your character sheet.'}
        </h1>
        <p className="mt-4 leading-7 text-slate-300">
          {error
            ? error
            : 'We are trading your authorization code for server-stored Spotify tokens, then sending you to the dossier.'}
        </p>

        {error && (
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button onClick={() => navigate('/')} className="glow-button rounded-2xl px-5 py-3 font-black">
              Back to start
            </button>
            <button onClick={() => window.location.reload()} className="ghost-button rounded-2xl px-5 py-3 font-bold">
              Retry callback
            </button>
          </div>
        )}
      </section>
    </main>
  )
}
