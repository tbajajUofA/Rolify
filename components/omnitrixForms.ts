export type FormId =
  | "bubble"
  | "radar"
  | "sankey"
  | "chord"
  | "streamgraph"
  | "heatmap"
  | "beeswarm"
  | "voronoi";

export type AlienForm = {
  id: FormId;
  name: string;
  codename: string;
  subtitle: string;
  scanLine: string;
};

export const ALIEN_FORMS: AlienForm[] = [
  {
    id: "bubble",
    name: "Overflow",
    codename: "OF-01",
    subtitle: "Top artist density",
    scanLine: "Scanning artist mass signatures"
  },
  {
    id: "radar",
    name: "Echo Echo",
    codename: "EE-02",
    subtitle: "Genre taste profile",
    scanLine: "Mapping sonic frequency bands"
  },
  {
    id: "sankey",
    name: "Upgrade",
    codename: "UP-03",
    subtitle: "Genre → artist → track",
    scanLine: "Tracing data flow pathways"
  },
  {
    id: "chord",
    name: "Chromastone",
    codename: "CS-04",
    subtitle: "Genre relationships",
    scanLine: "Detecting co-occurrence links"
  },
  {
    id: "streamgraph",
    name: "Big Chill",
    codename: "BC-05",
    subtitle: "Genre over time",
    scanLine: "Reading temporal phase shifts"
  },
  {
    id: "heatmap",
    name: "Heatblast",
    codename: "HB-06",
    subtitle: "Daily listening pulse",
    scanLine: "Calibrating activity heat index"
  },
  {
    id: "beeswarm",
    name: "Stinkfly",
    codename: "SF-07",
    subtitle: "Tempo × popularity",
    scanLine: "Clustering track DNA samples"
  },
  {
    id: "voronoi",
    name: "Wildmutt",
    codename: "WM-08",
    subtitle: "Artist territories",
    scanLine: "Partitioning play-count domains"
  }
];
