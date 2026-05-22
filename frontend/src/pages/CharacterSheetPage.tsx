/**
 * Character sheet / generated profile page.
 *
 * Purpose:
 * - Loads the backend-generated personality profile.
 * - Lets the user switch between long_term, medium_term, and short_term results.
 * - Renders demo profiles when demo mode is enabled.
 *
 * Cross references:
 * - Backend profile endpoint: backend/api/character.ts
 * - Frontend API wrapper: src/lib/spotify-api.ts -> generateCharacter()
 * - Demo data: src/lib/demo-data.ts
 * - Logout helper: src/lib/spotify-auth.ts
 */
import React, { useEffect, useState } from 'react'
import { generateCharacter, TimeRange } from '@/lib/spotify-api'
import { DEMO_PROFILES } from '@/lib/demo-data'
import { logout } from '@/lib/spotify-auth'

type CharacterStat = {
  name: string
  score: number
  label: string
}

type TrackSource = {
  id?: string
  name: string
  artists?: Array<{ name: string }>
  album?: { name?: string; images?: Array<{ url: string }> } | null
  popularity?: number
}

type ArtistSource = {
  id?: string
  name: string
  genres?: string[]
  popularity?: number
  followers?: number
  images?: Array<{ url: string }>
}

type CharacterResult = {
  demo?: boolean
  time_range?: string
  range_label?: string
  archetype?: string
  verdict?: string
  stats?: CharacterStat[]
  sources?: {
    top_tracks?: TrackSource[]
    top_artists?: ArtistSource[]
    audio_features?: {
      averages?: Record<string, number> | null
    }
    followed_artists?: ArtistSource[]
    playlists?: string[]
  }
}

const statFallbacks: Record<string, CharacterStat[]> = {
  carti: [
    { name: 'Chaos Velocity', score: 94, label: 'dangerously high' },
    { name: 'Shadow Drip', score: 88, label: 'suspiciously high' },
    { name: 'Impulse Control', score: 17, label: 'critically low' },
    { name: 'Mosh Pit Aura', score: 91, label: 'seek help' },
    { name: 'Mystery Branding', score: 83, label: 'concerning' }
  ],
  sabrina: [
    { name: 'Main Pop Quest', score: 92, label: 'suspiciously high' },
    { name: 'Glitter Defense', score: 86, label: 'high' },
    { name: 'Romance Cooldown', score: 28, label: 'low' },
    { name: 'Hook Accuracy', score: 96, label: 'dangerously high' },
    { name: 'Drama Resistance', score: 61, label: 'moderate' }
  ],
  tyler: [
    { name: 'Color Theory', score: 89, label: 'high' },
    { name: 'Genre Evasion', score: 93, label: 'suspiciously high' },
    { name: 'Villain Monologue', score: 74, label: 'concerning' },
    { name: 'Taste Confidence', score: 97, label: 'dangerously high' },
    { name: 'Normal Behavior', score: 19, label: 'critically low' }
  ],
  weeknd: [
    { name: 'Nocturnal Damage', score: 95, label: 'seek help' },
    { name: 'Synth Fog', score: 82, label: 'high' },
    { name: 'Healing Potion Use', score: 13, label: 'critically low' },
    { name: 'After Hours Stamina', score: 90, label: 'dangerously high' },
    { name: 'Emotional Transparency', score: 34, label: 'low' }
  ]
}

const demoTracks: Record<string, TrackSource[]> = {
  carti: ['Rage Portal', 'Vamp Anthem', 'Neon Sprint', 'Blacklight Boss Fight'].map((name, index) => ({
    id: `carti-${index}`,
    name,
    artists: [{ name: 'Demo Carti' }],
    popularity: 90 - index * 6
  })),
  sabrina: ['Espresso Spell', 'Charm Critical', 'Sugar Rush Inn', 'Glitter Lance'].map((name, index) => ({
    id: `sabrina-${index}`,
    name,
    artists: [{ name: 'Demo Sabrina' }],
    popularity: 88 - index * 4
  })),
  tyler: ['Garden Boss', 'Odd Questline', 'Velvet Map', 'Creative Fireball'].map((name, index) => ({
    id: `tyler-${index}`,
    name,
    artists: [{ name: 'Demo Tyler' }],
    popularity: 84 - index * 5
  })),
  weeknd: ['Moonlit Potion', 'After Hours Raid', 'Synth Cathedral', 'Velvet Curse'].map((name, index) => ({
    id: `weeknd-${index}`,
    name,
    artists: [{ name: 'Demo Weeknd' }],
    popularity: 91 - index * 5
  }))
}

const timeRanges: Array<{ value: TimeRange; label: string; subtitle: string }> = [
  { value: 'long_term', label: '1 Year', subtitle: 'legacy build' },
  { value: 'medium_term', label: '6 Months', subtitle: 'current arc' },
  { value: 'short_term', label: '4 Weeks', subtitle: 'recent chaos' }
]

function buildDemoResult(id: string): CharacterResult {
  const demoProfile = DEMO_PROFILES[id as keyof typeof DEMO_PROFILES] || DEMO_PROFILES.carti
  return {
    demo: true,
    range_label: 'Demo Realm',
    archetype: demoProfile.name,
    verdict: `${demoProfile.description}. This build is flashy, unstable, and absolutely convinced the aux cord is a royal scepter.`,
    stats: statFallbacks[demoProfile.id],
    sources: {
      top_tracks: demoTracks[demoProfile.id],
      top_artists: [
        { id: `${demoProfile.id}-artist-1`, name: demoProfile.name, genres: ['demo core', 'boss battle pop'], popularity: 92, followers: 999999 },
        { id: `${demoProfile.id}-artist-2`, name: 'Neon Guild', genres: ['fantasy synth'], popularity: 81, followers: 640000 },
        { id: `${demoProfile.id}-artist-3`, name: 'Dungeon Radio', genres: ['playlist magic'], popularity: 76, followers: 480000 }
      ],
      audio_features: {
        averages: { energy: 0.88, valence: 0.55, danceability: 0.82, acousticness: 0.12, tempo: 142, speechiness: 0.24 }
      },
      followed_artists: [],
      playlists: ['Main Quest Mix', 'Boss Fight Rotation', 'Potion Shop After Dark']
    }
  }
}

function bestImage(images?: Array<{ url: string }>) {
  return images?.[0]?.url
}

function formatPercent(value: unknown) {
  const numeric = Number(value)
  if (Number.isNaN(numeric)) return 'n/a'
  return `${Math.round(numeric * 100)}%`
}

function formatTempo(value: unknown) {
  const numeric = Number(value)
  if (Number.isNaN(numeric)) return 'n/a'
  return `${Math.round(numeric)} BPM`
}

export default function CharacterSheetPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('medium_term')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<CharacterResult | null>(null)
  const [profile, setProfile] = useState<{ display_name?: string } | null>(null)

  async function loadCharacter(range: TimeRange) {
    // Fetch the generated profile from the backend for the selected time range.
    setLoading(true)
    setError(null)

    try {
      const data = await generateCharacter(range)
      setResult(data)
      setProfile(data.user)
    } catch (err: any) {
      console.error(err)
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Demo mode never calls the backend profile endpoint.
    const demo = localStorage.getItem('demo_mode') === 'true'
    if (demo) {
      const id = localStorage.getItem('demo_profile_id') || 'carti'
      const demoProfile = DEMO_PROFILES[id as keyof typeof DEMO_PROFILES] || DEMO_PROFILES.carti
      setProfile({ display_name: demoProfile.name })
      setResult(buildDemoResult(id))
      setLoading(false)
      return
    }

    loadCharacter(timeRange)
  }, [timeRange])

  async function handleLogout() {
    // Logout is handled server-side so the httpOnly cookies are cleared.
    await logout()
  }

  if (loading) {
    return (
      <main className="app-shell grid min-h-screen place-items-center px-6 text-slate-100">
        <section className="glass-panel relative w-full max-w-lg rounded-[2rem] p-8 text-center">
          <div className="mx-auto h-20 w-20 rounded-full border-4 border-emerald-300/20 border-t-emerald-300" style={{ animation: 'slow-spin 1s linear infinite' }} />
          <p className="rune-label mt-8 text-xs">Reading the runes</p>
          <h1 className="mt-4 text-4xl font-black">Generating your build</h1>
          <p className="mt-4 text-slate-300">Pulling Spotify signals and shaping them into stats, archetype, and verdict.</p>
        </section>
      </main>
    )
  }

  if (error) {
    return (
      <main className="app-shell grid min-h-screen place-items-center px-6 text-slate-100">
        <section className="glass-panel w-full max-w-xl rounded-[2rem] p-8 text-center">
          <p className="rune-label text-xs">Character forge failed</p>
          <h1 className="mt-4 text-4xl font-black text-white">The spell fizzled.</h1>
          <p className="mt-4 rounded-2xl border border-red-300/25 bg-red-400/10 p-4 text-red-100">{error}</p>
          <button onClick={() => loadCharacter(timeRange)} className="glow-button mt-7 rounded-2xl px-6 py-3 font-black">
            Try again
          </button>
        </section>
      </main>
    )
  }

  const stats = result?.stats || []
  const sources = result?.sources || {}
  const tracks = sources.top_tracks || []
  const artists = sources.top_artists || []
  const playlists = sources.playlists || []
  const averages = sources.audio_features?.averages || {}
  const displayName = profile?.display_name || 'Unknown Listener'
  const archetype = result?.archetype || 'Untitled Listener'
  const heroArt = bestImage(tracks[0]?.album?.images) || bestImage(artists[0]?.images)

  return (
    <main className="app-shell min-h-screen px-5 py-6 text-slate-100 sm:px-8 lg:px-10">
      <div className="orb left-[-7rem] top-24 h-80 w-80 bg-emerald-400/20" />
      <div className="orb bottom-0 right-[-8rem] h-96 w-96 bg-violet-500/25" />

      <div className="relative mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="rune-label text-xs">{result?.demo ? 'Demo character dossier' : 'Spotify character dossier'}</p>
            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">{displayName}</h1>
          </div>
          <button onClick={handleLogout} className="ghost-button w-fit rounded-full px-5 py-2 text-sm font-bold">
            Logout
          </button>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="glass-panel overflow-hidden rounded-[2rem]">
            <div className="relative min-h-[28rem] p-6 sm:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/16 via-cyan-400/8 to-violet-500/20" />
              {heroArt && <img src={heroArt} alt="" className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-20 mix-blend-screen" />}
              <div className="relative max-w-2xl">
                <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200">
                  Active era: {result?.range_label || 'n/a'}
                </div>
                <h2 className="mt-8 text-5xl font-black leading-none tracking-tight text-white sm:text-6xl">
                  {archetype}
                </h2>
                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                  A music-fueled build sheet forged from your top artists, tracks, playlist names, and sonic fingerprints.
                </p>

                <div className="mt-10 grid gap-3 sm:grid-cols-3">
                  {timeRanges.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTimeRange(option.value)}
                      disabled={result?.demo}
                      className={`rounded-2xl border p-4 text-left transition ${
                        timeRange === option.value
                          ? 'border-emerald-300/70 bg-emerald-300/15 text-white shadow-[0_0_30px_rgba(16,185,129,0.18)]'
                          : 'border-white/10 bg-slate-950/40 text-slate-300 hover:border-emerald-300/40'
                      } ${result?.demo ? 'cursor-not-allowed opacity-70' : ''}`}
                    >
                      <div className="font-black">{option.label}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{option.subtitle}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {stats.map((stat) => (
              <article key={stat.name} className="neon-card rounded-3xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-200">{stat.label}</p>
                    <h3 className="mt-2 text-xl font-black text-white">{stat.name}</h3>
                  </div>
                  <div className="text-4xl font-black text-white">{stat.score}</div>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-950/80">
                  <div className="stat-bar h-full rounded-full" style={{ width: `${Math.max(0, Math.min(100, stat.score))}%` }} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <article className="glass-panel rounded-[2rem] p-6">
            <p className="rune-label text-xs">Final prophecy</p>
            <blockquote className="mt-5 text-2xl font-black leading-snug text-white">
              "{result?.verdict || 'No verdict provided.'}"
            </blockquote>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Energy</p>
                <p className="mt-1 text-2xl font-black text-emerald-200">{formatPercent(averages.energy)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Tempo</p>
                <p className="mt-1 text-2xl font-black text-cyan-200">{formatTempo(averages.tempo)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Dance</p>
                <p className="mt-1 text-2xl font-black text-violet-200">{formatPercent(averages.danceability)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Valence</p>
                <p className="mt-1 text-2xl font-black text-amber-200">{formatPercent(averages.valence)}</p>
              </div>
            </div>
          </article>

          <article className="glass-panel rounded-[2rem] p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="rune-label text-xs">Source relics</p>
                <h2 className="mt-2 text-3xl font-black text-white">Tracks that powered the build</h2>
              </div>
              <span className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 sm:inline-flex">
                {tracks.length} tracks
              </span>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {tracks.slice(0, 6).map((track, index) => {
                const image = bestImage(track.album?.images)
                return (
                  <div key={track.id || track.name} className="flex gap-4 rounded-3xl border border-white/10 bg-slate-950/45 p-3">
                    <div className="album-tile grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl text-lg font-black text-white">
                      {image ? <img src={image} alt="" className="h-full w-full object-cover" /> : index + 1}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-black text-white">{track.name}</h3>
                      <p className="mt-1 truncate text-sm text-slate-400">
                        {(track.artists || []).map((artist) => artist.name).join(', ') || 'Unknown artist'}
                      </p>
                      {typeof track.popularity === 'number' && <p className="mt-2 text-xs text-emerald-200">Popularity {track.popularity}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </article>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <article className="glass-panel rounded-[2rem] p-6">
            <p className="rune-label text-xs">Guild leaders</p>
            <h2 className="mt-2 text-3xl font-black text-white">Top artists</h2>
            <div className="mt-6 space-y-3">
              {artists.slice(0, 5).map((artist, index) => (
                <div key={artist.id || artist.name} className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-violet-400/20 font-black">
                    {bestImage(artist.images) ? <img src={bestImage(artist.images)} alt="" className="h-full w-full object-cover" /> : index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-black text-white">{artist.name}</h3>
                    <p className="truncate text-sm text-slate-400">{(artist.genres || []).slice(0, 3).join(' / ') || 'genre unknown'}</p>
                  </div>
                  {typeof artist.popularity === 'number' && <div className="text-sm font-bold text-emerald-200">{artist.popularity}</div>}
                </div>
              ))}
            </div>
          </article>

          <article className="glass-panel rounded-[2rem] p-6">
            <p className="rune-label text-xs">Inventory</p>
            <h2 className="mt-2 text-3xl font-black text-white">Playlist artifacts</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {playlists.length ? (
                playlists.slice(0, 12).map((playlist) => (
                  <span key={playlist} className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100">
                    {playlist}
                  </span>
                ))
              ) : (
                <p className="text-slate-400">No playlist names were available for this run.</p>
              )}
            </div>
          </article>
        </section>
      </div>
    </main>
  )
}
