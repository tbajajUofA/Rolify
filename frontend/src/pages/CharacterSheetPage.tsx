import React, { useEffect, useState } from 'react'
import { generateCharacter, TimeRange } from '@/lib/spotify-api'
import { DEMO_PROFILES } from '@/lib/demo-data'
import { logout } from '@/lib/spotify-auth'

export default function CharacterSheetPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('medium_term')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  async function loadCharacter(range: TimeRange) {
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
    const demo = localStorage.getItem('demo_mode') === 'true'
    if (demo) {
      const id = localStorage.getItem('demo_profile_id') || 'carti'
      const demoProfile = DEMO_PROFILES[id as keyof typeof DEMO_PROFILES]
      setProfile({ display_name: demoProfile.name })
      setResult({
        demo: true,
        archetype: demoProfile.name,
        verdict: 'Demo profile preview only.',
        stats: []
      })
      setLoading(false)
      return
    }

    loadCharacter(timeRange)
  }, [timeRange])

  if (loading) return <main className="p-8">Loading...</main>
  if (error) return <main className="p-8"><p className="text-red-400">{error}</p></main>

  async function handleLogout() {
    await logout()
  }

  const timeRanges: Array<{ value: TimeRange; label: string }> = [
    { value: 'long_term', label: '1 Year' },
    { value: 'medium_term', label: '6 Months' },
    { value: 'short_term', label: '4 Weeks' }
  ]

  return (
    <main className="min-h-screen p-8 bg-slate-950 text-slate-100">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{profile?.display_name || 'Character'}</h1>
        <div>
          <button onClick={handleLogout} className="px-3 py-1 bg-red-600 text-white rounded">Logout</button>
        </div>
      </div>
      <div className="mt-6 flex gap-3 flex-wrap">
        {timeRanges.map((option) => (
          <button
            key={option.value}
            onClick={() => setTimeRange(option.value)}
            className={`px-4 py-2 rounded border ${timeRange === option.value ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-200'}`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {result?.demo ? (
        <p className="mt-4">Demo profile: minimal preview.</p>
      ) : (
        <div className="mt-4 space-y-3 max-w-3xl">
          <div><strong>Time Range:</strong> {result?.range_label || 'n/a'}</div>
          <div><strong>Archetype:</strong> {result?.archetype}</div>
          <div><strong>Verdict:</strong> {result?.verdict}</div>
          <div className="mt-2"><strong>Stats:</strong></div>
          <div className="grid gap-3 md:grid-cols-2">
            {(result?.stats || []).map((stat: any) => (
              <div key={stat.name} className="rounded border border-slate-700 bg-slate-900 p-4">
                <div className="text-sm uppercase tracking-wide text-slate-400">{stat.label}</div>
                <div className="text-lg font-semibold">{stat.name}</div>
                <div className="mt-2 text-2xl">{stat.score}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
