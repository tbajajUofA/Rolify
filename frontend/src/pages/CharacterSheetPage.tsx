import React, { useEffect, useState } from 'react'
import { getUserProfile, getTopTracks, getTopArtists, getAudioFeatures } from '@/lib/spotify-api'
import { calculateStats, determineClass, calculateLevel, determineAlignment } from '@/lib/character-generator'
import { DEMO_PROFILES } from '@/lib/demo-data'
import { logout } from '@/lib/spotify-auth'
import { useNavigate } from 'react-router-dom'

export default function CharacterSheetPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const demo = localStorage.getItem('demo_mode') === 'true'
    if (demo) {
      const id = localStorage.getItem('demo_profile_id') || 'carti'
      const demoProfile = DEMO_PROFILES[id as keyof typeof DEMO_PROFILES]
      setProfile({ display_name: demoProfile.name })
      setStats({ demo: true })
      setLoading(false)
      return
    }

    ;(async () => {
      try {
        // backend will read access token from cookie
        const [me, tracks, artists] = await Promise.all([
          fetch('/api/spotify/me').then(r => r.json()),
          fetch('/api/spotify/me/top/tracks?limit=50').then(r => r.json()).then(d => d.items || d),
          fetch('/api/spotify/me/top/artists?limit=20').then(r => r.json()).then(d => d.items || d)
        ])
        const featureIds = (tracks || []).map((t: any) => t.id).filter(Boolean)
        const features = featureIds.length ? await fetch(`/api/spotify/audio-features?ids=${featureIds.join(',')}`).then(r => r.json()).then(d => d.audio_features || d) : []

        const calc = calculateStats(features)
        const cls = determineClass(artists)
        const level = calculateLevel(tracks, artists)
        const alignment = determineAlignment(calc)

        setProfile(me)
        setStats({ stats: calc, class: cls, level, alignment })
      } catch (err: any) {
        console.error(err)
        setError(err?.message || String(err))
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <main className="p-8">Loading...</main>
  if (error) return <main className="p-8"><p className="text-red-400">{error}</p></main>

  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <main className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{profile?.display_name || 'Character'}</h1>
        <div>
          <button onClick={handleLogout} className="px-3 py-1 bg-red-600 text-white rounded">Logout</button>
        </div>
      </div>
      {stats?.demo ? (
        <p className="mt-4">Demo profile: minimal preview.</p>
      ) : (
        <div className="mt-4 space-y-2">
          <div><strong>Class:</strong> {stats.class}</div>
          <div><strong>Level:</strong> {stats.level}</div>
          <div><strong>Alignment:</strong> {stats.alignment}</div>
          <div className="mt-2"><strong>Stats:</strong></div>
          <pre className="bg-slate-900 p-3 rounded">{JSON.stringify(stats.stats, null, 2)}</pre>
        </div>
      )}
    </main>
  )
}
