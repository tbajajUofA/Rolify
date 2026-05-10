import { AudioFeatures, SpotifyArtist, SpotifyTrack } from '@/types/spotify'

export interface CharacterStats {
  strength: number
  charisma: number
  agility: number
  wisdom: number
  speed: number
  focus: number
}

export function calculateStats(features: AudioFeatures[]): CharacterStats {
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / Math.max(arr.length, 1)
  const energies = features.map(f => f.energy)
  const valences = features.map(f => f.valence)
  const dance = features.map(f => f.danceability)
  const acoustic = features.map(f => f.acousticness)
  const tempo = features.map(f => f.tempo)
  const instrumental = features.map(f => f.instrumentalness)

  return {
    strength: Math.round(avg(energies) * 100),
    charisma: Math.round(avg(valences) * 100),
    agility: Math.round(avg(dance) * 100),
    wisdom: Math.round((1 - avg(acoustic)) * 100),
    speed: Math.round((avg(tempo) / 200) * 100),
    focus: Math.round((1 - avg(instrumental)) * 100)
  }
}

export function determineClass(artists: SpotifyArtist[]) {
  const genres = artists.flatMap(a => a.genres || [])
  if (genres.some(g => /hip hop|rap|trap/i.test(g))) return 'Rogue'
  if (genres.some(g => /pop|indie|singer-songwriter/i.test(g))) return 'Bard'
  if (genres.some(g => /electronic|edm|house|techno/i.test(g))) return 'Enchanter'
  return 'Wildcard'
}

export function calculateLevel(tracks: SpotifyTrack[], artists: SpotifyArtist[]) {
  const uniqueTracks = new Set(tracks.map(t => t.id)).size
  const uniqueArtists = new Set(artists.map(a => a.id)).size
  return Math.min(1 + Math.floor(uniqueTracks / 10) + Math.floor(uniqueArtists / 5), 10)
}

export function determineAlignment(stats: CharacterStats) {
  const c = stats.charisma >= 50
  const s = stats.strength >= 50
  if (c && s) return 'Lawful Good'
  if (c && !s) return 'Chaotic Good'
  if (!c && s) return 'Lawful Evil'
  if (!c && !s) return 'Chaotic Evil'
  return 'True Neutral'
}
