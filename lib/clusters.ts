import type { AudioFeatures, ClusterName, VisualTrack } from "@/lib/types";

const CLUSTER_COLORS: Record<ClusterName, string> = {
  "Chill / acoustic": "#1ED760",
  "Feel-good pop": "#FAC775",
  "High-energy dance": "#00E5FF",
  "Moody / introspective": "#7F77DD"
};

const INITIAL_CENTROIDS: Record<ClusterName, AudioFeatures> = {
  "Chill / acoustic": {
    energy: 25,
    valence: 48,
    danceability: 42,
    acousticness: 82,
    tempo: 36
  },
  "Feel-good pop": {
    energy: 68,
    valence: 82,
    danceability: 72,
    acousticness: 22,
    tempo: 62
  },
  "High-energy dance": {
    energy: 88,
    valence: 64,
    danceability: 90,
    acousticness: 8,
    tempo: 82
  },
  "Moody / introspective": {
    energy: 38,
    valence: 22,
    danceability: 46,
    acousticness: 44,
    tempo: 44
  }
};

const CLUSTER_NAMES = Object.keys(INITIAL_CENTROIDS) as ClusterName[];

function distance(a: AudioFeatures, b: AudioFeatures) {
  return Math.sqrt(
    (a.energy - b.energy) ** 2 +
      (a.valence - b.valence) ** 2 +
      (a.danceability - b.danceability) ** 2 +
      (a.acousticness - b.acousticness) ** 2 +
      (a.tempo - b.tempo) ** 2
  );
}

function average(features: AudioFeatures[]) {
  const total = features.reduce<AudioFeatures>(
    (sum, item) => ({
      energy: sum.energy + item.energy,
      valence: sum.valence + item.valence,
      danceability: sum.danceability + item.danceability,
      acousticness: sum.acousticness + item.acousticness,
      tempo: sum.tempo + item.tempo
    }),
    { energy: 0, valence: 0, danceability: 0, acousticness: 0, tempo: 0 }
  );

  return {
    energy: total.energy / features.length,
    valence: total.valence / features.length,
    danceability: total.danceability / features.length,
    acousticness: total.acousticness / features.length,
    tempo: total.tempo / features.length
  };
}

export function clusterTracks<T extends { features: AudioFeatures }>(tracks: T[]) {
  let centroids = { ...INITIAL_CENTROIDS };
  let assignments = new Map<T, ClusterName>();

  for (let iteration = 0; iteration < 8; iteration += 1) {
    tracks.forEach((track) => {
      const name = CLUSTER_NAMES.reduce((closest, candidate) =>
        distance(track.features, centroids[candidate]) < distance(track.features, centroids[closest])
          ? candidate
          : closest
      );

      assignments.set(track, name);
    });

    CLUSTER_NAMES.forEach((name) => {
      const members = tracks.filter((track) => assignments.get(track) === name);
      if (members.length > 0) {
        centroids = {
          ...centroids,
          [name]: average(members.map((member) => member.features))
        };
      }
    });
  }

  return tracks.map<VisualTrack>((track) => {
    const cluster = assignments.get(track) ?? "Moody / introspective";

    return {
      ...track,
      cluster,
      clusterColor: CLUSTER_COLORS[cluster]
    } as VisualTrack;
  });
}
