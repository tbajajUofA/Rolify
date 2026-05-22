/**
 * Legacy character math helpers.
 *
 * Purpose:
 * - Preserves the original locally computed RPG stats and class logic.
 * - Useful as a reference if the backend-generated character pipeline needs a fallback or rollback.
 *
 * Current status:
 * - The active app flow now uses backend/api/character.ts via src/lib/spotify-api.ts.
 * - CharacterSheetPage.tsx no longer depends on these helpers for the main flow.
 */
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
  // Convert audio features into 0-100 stat values.
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
  // Original local class logic based on artist genres.
  const genres = artists.flatMap(a => a.genres || [])
  if (genres.some(g => /hip hop|rap|trap/i.test(g))) return 'Rogue'
  if (genres.some(g => /pop|indie|singer-songwriter/i.test(g))) return 'Bard'
  if (genres.some(g => /electronic|edm|house|techno/i.test(g))) return 'Enchanter'
  return 'Wildcard'
}

export function calculateLevel(tracks: SpotifyTrack[], artists: SpotifyArtist[]) {
  // Original local level logic based on diversity of tracks and artists.
  const uniqueTracks = new Set(tracks.map(t => t.id)).size
  const uniqueArtists = new Set(artists.map(a => a.id)).size
  return Math.min(1 + Math.floor(uniqueTracks / 10) + Math.floor(uniqueArtists / 5), 10)
}

export function determineAlignment(stats: CharacterStats) {
  // Original local alignment logic.
  const c = stats.charisma >= 50
  const s = stats.strength >= 50
  if (c && s) return 'Lawful Good'
  if (c && !s) return 'Chaotic Good'
  if (!c && s) return 'Lawful Evil'
  if (!c && !s) return 'Chaotic Evil'
  return 'True Neutral'
}
