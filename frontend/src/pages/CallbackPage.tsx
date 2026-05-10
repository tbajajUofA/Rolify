import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleSpotifyCallback } from '@/lib/spotify-auth'

export default function CallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (!code) {
      setError('No code in callback')
      return
    }

    ;(async () => {
      try {
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
