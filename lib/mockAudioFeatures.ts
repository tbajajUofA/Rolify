import type { AudioFeatures, Track } from "@/lib/types";

function hashTrackId(id: string) {
  let hash = 2166136261;

  for (let index = 0; index < id.length; index += 1) {
    hash ^= id.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return Math.abs(hash >>> 0);
}

function seededValue(seed: number, salt: number) {
  const value = Math.sin(seed + salt * 9999) * 10000;
  return value - Math.floor(value);
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function getMockAudioFeatures(track: Track): AudioFeatures {
  const seed = hashTrackId(track.id);
  const genres = track.artists.flatMap((artist) => artist.genres).join(" ").toLowerCase();

  let energy = 30 + seededValue(seed, 1) * 62;
  let valence = 24 + seededValue(seed, 2) * 68;
  let danceability = 28 + seededValue(seed, 3) * 64;
  let acousticness = 8 + seededValue(seed, 4) * 64;
  let tempo = 70 + seededValue(seed, 5) * 95;

  if (/(edm|dance|house|techno|club|pop|disco)/.test(genres)) {
    energy += 16;
    danceability += 18;
    valence += 8;
    acousticness -= 12;
    tempo += 8;
  }

  if (/(acoustic|folk|singer-songwriter|indie folk|americana)/.test(genres)) {
    acousticness += 24;
    energy -= 14;
    danceability -= 5;
    tempo -= 6;
  }

  if (/(metal|punk|hardcore|rock)/.test(genres)) {
    energy += 20;
    valence -= 12;
    acousticness -= 10;
    tempo += 10;
  }

  if (/(r&b|soul|jazz|ambient|sad|emo|dream|lo-fi)/.test(genres)) {
    valence -= 8;
    energy -= 5;
    acousticness += 10;
  }

  // Placeholder for a real audio-analysis source; Spotify audio-features/audio-analysis are not used.
  return {
    energy: clamp(energy),
    valence: clamp(valence),
    danceability: clamp(danceability),
    acousticness: clamp(acousticness),
    tempo: clamp(((tempo - 60) / 120) * 100)
  };
}
