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
import { DEMO_PROFILES } from '@/lib/demo-data'

const demoAccents: Record<string, string> = {
  carti: 'from-red-500/30 via-fuchsia-500/20 to-slate-950',
  sabrina: 'from-pink-400/30 via-amber-300/20 to-slate-950',
  tyler: 'from-lime-400/30 via-orange-400/20 to-slate-950',
  weeknd: 'from-violet-500/30 via-cyan-400/20 to-slate-950'
}

const featureCards = [
  {
    title: 'Summon the playlist spirit',
    copy: 'Spotify top tracks, artists, audio features, playlists, and follows become the raw spell components.'
  },
  {
    title: 'Roll brutally honest stats',
    copy: 'Gemini turns taste into five RPG attributes with labels that are a little too personal.'
  },
  {
    title: 'Compare your eras',
    copy: 'Swap between four weeks, six months, and one year to see which version of you wins initiative.'
  }
]

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
    <main className="app-shell text-slate-100">
      <div className="orb left-[-8rem] top-[-7rem] h-72 w-72 bg-emerald-400/30" />
      <div className="orb bottom-[-10rem] right-[-6rem] h-96 w-96 bg-violet-500/30" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-emerald-300/40 bg-emerald-400/10 text-lg font-black text-emerald-200 shadow-[0_0_34px_rgba(16,185,129,0.25)]">
              R
            </div>
            <div>
              <p className="rune-label text-[0.65rem]">Rolify</p>
              <p className="text-sm text-slate-400">Spotify RPG character forge</p>
            </div>
          </div>
          <button onClick={() => tryDemo('carti')} className="ghost-button rounded-full px-4 py-2 text-sm font-semibold">
            Quick Demo
          </button>
        </nav>

        <div className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[1.08fr_0.92fr] lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.85)]" />
              Your music taste, converted into a character sheet
            </div>

            <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Discover the RPG class hiding in your Spotify history.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Rolify reads your listening eras, top artists, sonic traits, and playlist lore, then forges a dramatic character dossier with stats, archetype, and one ruthless verdict.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={handleLogin} className="glow-button rounded-2xl px-6 py-4 text-base font-black">
                Login with Spotify
              </button>
              <button onClick={() => tryDemo('sabrina')} className="ghost-button rounded-2xl px-6 py-4 text-base font-bold">
                Try a polished demo
              </button>
            </div>

            {!isSpotifyConfigured() && (
              <div className="mt-5 rounded-2xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
                Spotify login is not configured yet. Demo mode is ready for local exploration.
              </div>
            )}

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {featureCards.map((feature, index) => (
                <article key={feature.title} className="neon-card rounded-3xl p-5">
                  <div className="text-sm font-black text-emerald-200">0{index + 1}</div>
                  <h2 className="mt-3 text-lg font-bold text-white">{feature.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{feature.copy}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="glass-panel rounded-[2rem] p-4 sm:p-6">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
              <p className="rune-label text-xs">Choose a premade champion</p>
              <h2 className="mt-3 text-3xl font-black text-white">Demo party</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Preview the final dossier without connecting Spotify.
              </p>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {Object.values(DEMO_PROFILES).map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => tryDemo(profile.id)}
                  className={`group rounded-3xl border border-white/10 bg-gradient-to-br ${demoAccents[profile.id]} p-5 text-left shadow-2xl transition duration-200 hover:-translate-y-1 hover:border-emerald-300/50`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-300">{profile.id}</p>
                      <h3 className="mt-3 text-2xl font-black text-white">{profile.name}</h3>
                    </div>
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold text-emerald-100">
                      Demo
                    </span>
                  </div>
                  <p className="mt-6 min-h-12 text-sm leading-6 text-slate-300">{profile.description}</p>
                  <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-950/70">
                    <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300 transition-all duration-300 group-hover:w-full" />
                  </div>
                </button>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
