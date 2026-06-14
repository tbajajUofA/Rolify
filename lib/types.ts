export type TimeRange = "short_term" | "medium_term" | "long_term";

export type SpotifyImage = {
  url: string;
  height: number | null;
  width: number | null;
};

export type Artist = {
  id: string;
  name: string;
  genres: string[];
  images: SpotifyImage[];
  popularity: number;
  externalUrl: string;
};

export type Track = {
  id: string;
  name: string;
  popularity: number;
  albumArt: string;
  externalUrl: string;
  artists: Pick<Artist, "id" | "name" | "genres">[];
};

export type RecentlyPlayedTrack = {
  playedAt: string;
  track: Track;
};

export type AudioFeatures = {
  energy: number;
  valence: number;
  danceability: number;
  acousticness: number;
  tempo: number;
};

export type ClusterName =
  | "Chill / acoustic"
  | "Feel-good pop"
  | "High-energy dance"
  | "Moody / introspective";

export type Cluster = {
  name: ClusterName;
  color: string;
  centroid: AudioFeatures;
};

export type VisualTrack = Track & {
  features: AudioFeatures;
  cluster: ClusterName;
  clusterColor: string;
};

export type GenreCount = {
  genre: string;
  count: number;
  percentage: number;
};

export type TrajectoryPoint = {
  day: string;
  count: number;
};
