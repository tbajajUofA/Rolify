const {
  getUserProfile,
  getTopTracks,
  getTopArtists,
  getAudioFeatures,
  getFollowedArtists,
  getPlaylists
} = require('./spotify')
const { generateGeminiJson } = require('./gemini')

const TIME_RANGE_LABELS = {
  long_term: '1 Year',
  medium_term: '6 Months',
  short_term: '4 Weeks'
}

function normalizeTimeRange(timeRange) {
  return TIME_RANGE_LABELS[timeRange] ? timeRange : 'medium_term'
}

function buildPrompt({ timeRange, user, topTracks, topArtists, audioFeatures, followedArtists, playlists }) {
  const trackLines = topTracks.tracks
    .map((track, index) => `${index + 1}. ${track.name} - ${(track.artists || []).map((artist) => artist.name).join(', ')} (popularity: ${track.popularity ?? 'n/a'})`)
    .join('\n')

  const artistLines = topArtists.artists
    .map(
      (artist, index) =>
        `${index + 1}. ${artist.name} — genres: ${(artist.genres || []).slice(0, 3).join(', ') || 'none'} (popularity: ${artist.popularity ?? 'n/a'}, followers: ${artist.followers ?? 0})`
    )
    .join('\n')

  const averages = audioFeatures.averages || {}
  const playlistNames = playlists.playlists.length ? playlists.playlists.map((playlist) => `"${playlist}"`).join(', ') : 'none'
  const followedNames = followedArtists.artists.length ? followedArtists.artists.slice(0, 10).map((artist) => artist.name).join(', ') : 'none'

  return `You are a brutally honest music personality analyst.

TIME PERIOD: ${TIME_RANGE_LABELS[timeRange]}

USER:
- Display name: ${user.display_name || user.id || 'Unknown'}

TOP 10 TRACKS:
${trackLines || 'none'}

TOP 5 ARTISTS:
${artistLines || 'none'}

AUDIO FEATURES (averaged across top tracks):
- Energy: ${averages.energy ?? 'n/a'}
- Valence: ${averages.valence ?? 'n/a'}
- Danceability: ${averages.danceability ?? 'n/a'}
- Acousticness: ${averages.acousticness ?? 'n/a'}
- Tempo: ${averages.tempo ?? 'n/a'} BPM
- Instrumentalness: ${averages.instrumentalness ?? 'n/a'}
- Speechiness: ${averages.speechiness ?? 'n/a'}

FOLLOWED ARTISTS (sample): ${followedNames}
PLAYLIST NAMES: ${playlistNames}

Return ONLY valid JSON in this exact structure:
{
  "archetype": "a blunt, cutting 4-6 word label",
  "stats": [
    { "name": "short stat name", "score": 0, "label": "critically low" }
  ],
  "verdict": "one brutal closing sentence"
}

Rules:
- Generate exactly 5 stats.
- Stat names should be personal and specific.
- Scores must be numbers from 0 to 100.
- Labels must be one of: "critically low", "low", "moderate", "high", "suspiciously high", "concerning", "seek help", "dangerously high".
- Return only JSON.`
}

function clampScore(value) {
  const score = Number(value)
  if (Number.isNaN(score)) return 0
  return Math.max(0, Math.min(100, Math.round(score)))
}

function normalizeStats(stats, fallbackStats) {
  const source = Array.isArray(stats) ? stats.slice(0, 5) : []
  while (source.length < 5) {
    source.push(fallbackStats[source.length])
  }

  return source.slice(0, 5).map((stat, index) => ({
    name: String(stat?.name || fallbackStats[index].name),
    score: clampScore(stat?.score ?? fallbackStats[index].score),
    label: String(stat?.label || fallbackStats[index].label)
  }))
}

function buildFallbackStats(audioFeatures, topArtists) {
  const averages = audioFeatures.averages || {}
  const popCount = topArtists.artists.filter((artist) => (artist.genres || []).some((genre) => /pop/i.test(genre))).length

  return [
    {
      name: 'Main Character Energy',
      score: clampScore((averages.valence || 0.4) * 100),
      label: 'moderate'
    },
    {
      name: 'Sadness Commitment',
      score: clampScore((1 - (averages.valence || 0.4)) * 100),
      label: 'high'
    },
    {
      name: 'Dance Floor Urgency',
      score: clampScore((averages.danceability || 0.4) * 100),
      label: 'moderate'
    },
    {
      name: 'Acoustic Recovery',
      score: clampScore((averages.acousticness || 0.3) * 100),
      label: 'low'
    },
    {
      name: 'Pop Contamination',
      score: clampScore(popCount * 20),
      label: 'suspiciously high'
    }
  ]
}

async function generateCharacterProfile(accessToken, requestedTimeRange = 'medium_term') {
  const timeRange = normalizeTimeRange(requestedTimeRange)

  const [user, topTracks, topArtists, followedArtists, playlists] = await Promise.all([
    getUserProfile(accessToken),
    getTopTracks(accessToken, { time_range: timeRange, limit: 10 }),
    getTopArtists(accessToken, { time_range: timeRange, limit: 5 }),
    getFollowedArtists(accessToken),
    getPlaylists(accessToken)
  ])

  const audioFeatures = await getAudioFeatures(accessToken, {
    ids: topTracks.tracks.map((track) => track.id),
    time_range: timeRange,
    limit: 10
  })

  const fallbackStats = buildFallbackStats(audioFeatures, topArtists)
  const prompt = buildPrompt({ timeRange, user, topTracks, topArtists, audioFeatures, followedArtists, playlists })

  let profile
  try {
    profile = await generateGeminiJson(prompt)
  } catch (error) {
    profile = {
      archetype: 'Data-Driven Music Gremlin',
      stats: fallbackStats,
      verdict: 'Gemini was unavailable, so your playlist still did the talking.'
    }
  }

  return {
    user,
    time_range: timeRange,
    range_label: TIME_RANGE_LABELS[timeRange],
    archetype: String(profile.archetype || 'Untitled Listener'),
    stats: normalizeStats(profile.stats, fallbackStats),
    verdict: String(profile.verdict || 'No verdict provided.'),
    sources: {
      top_tracks: topTracks.tracks,
      top_artists: topArtists.artists,
      audio_features: audioFeatures,
      followed_artists: followedArtists.artists,
      playlists: playlists.playlists
    }
  }
}

module.exports = {
  TIME_RANGE_LABELS,
  normalizeTimeRange,
  buildPrompt,
  generateCharacterProfile
}