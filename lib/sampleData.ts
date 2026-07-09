import type { Artist, RecentlyPlayedTrack, Track } from "@/lib/types";

function artist(
  id: string,
  name: string,
  genres: string[],
  popularity: number
): Artist {
  return {
    id,
    name,
    genres,
    images: [{ url: "", height: 640, width: 640 }],
    popularity,
    externalUrl: `https://open.spotify.com/artist/${id}`
  };
}

function track(
  id: string,
  name: string,
  artistEntries: { id: string; name: string; genres: string[] }[],
  popularity: number
): Track {
  return {
    id,
    name,
    popularity,
    albumArt: "",
    externalUrl: `https://open.spotify.com/track/${id}`,
    artists: artistEntries
  };
}

const SAMPLE_ARTISTS: Artist[] = [
  artist("a1", "Tyler, The Creator", ["hip hop", "alternative hip hop", "neo soul"], 88),
  artist("a2", "Radiohead", ["art rock", "alternative rock", "electronic"], 84),
  artist("a3", "Daft Punk", ["french house", "electronic", "disco"], 82),
  artist("a4", "Phoebe Bridgers", ["indie folk", "chamber pop", "singer-songwriter"], 79),
  artist("a5", "Kendrick Lamar", ["hip hop", "west coast hip hop", "conscious hip hop"], 91),
  artist("a6", "Tame Impala", ["neo-psychedelia", "indie rock", "psychedelic pop"], 86),
  artist("a7", "FKA twigs", ["art pop", "electronic", "r&b"], 74),
  artist("a8", "Bon Iver", ["indie folk", "chamber pop", "art pop"], 77),
  artist("a9", "Justice", ["electronic", "french house", "electro"], 71),
  artist("a10", "Mitski", ["indie rock", "chamber pop", "singer-songwriter"], 80),
  artist("a11", "Frank Ocean", ["r&b", "alternative r&b", "art pop"], 87),
  artist("a12", "Caribou", ["electronic", "idm", "neo-psychedelia"], 68),
  artist("a13", "SZA", ["r&b", "neo soul", "alternative r&b"], 89),
  artist("a14", "Arcade Fire", ["indie rock", "art rock", "chamber pop"], 76),
  artist("a15", "Gorillaz", ["alternative rock", "electronic", "trip hop"], 83),
  artist("a16", "Beach House", ["dream pop", "shoegaze", "indie pop"], 72),
  artist("a17", "Kaytranada", ["electronic", "house", "hip hop"], 75),
  artist("a18", "Clairo", ["bedroom pop", "indie pop", "lo-fi"], 78),
  artist("a19", "Massive Attack", ["trip hop", "electronic", "downtempo"], 70),
  artist("a20", "Solange", ["r&b", "neo soul", "art pop"], 73)
];

const SAMPLE_TRACKS: Track[] = [
  track("t1", "EARFQUAKE", [{ id: "a1", name: "Tyler, The Creator", genres: ["hip hop", "alternative hip hop"] }], 85),
  track("t2", "Everything In Its Right Place", [{ id: "a2", name: "Radiohead", genres: ["art rock", "alternative rock"] }], 82),
  track("t3", "One More Time", [{ id: "a3", name: "Daft Punk", genres: ["french house", "electronic"] }], 88),
  track("t4", "Kyoto", [{ id: "a4", name: "Phoebe Bridgers", genres: ["indie folk", "chamber pop"] }], 79),
  track("t5", "HUMBLE.", [{ id: "a5", name: "Kendrick Lamar", genres: ["hip hop", "west coast hip hop"] }], 90),
  track("t6", "The Less I Know The Better", [{ id: "a6", name: "Tame Impala", genres: ["neo-psychedelia", "indie rock"] }], 87),
  track("t7", "cellophane", [{ id: "a7", name: "FKA twigs", genres: ["art pop", "electronic"] }], 76),
  track("t8", "Holocene", [{ id: "a8", name: "Bon Iver", genres: ["indie folk", "chamber pop"] }], 81),
  track("t9", "Genesis", [{ id: "a9", name: "Justice", genres: ["electronic", "french house"] }], 74),
  track("t10", "Nobody", [{ id: "a10", name: "Mitski", genres: ["indie rock", "chamber pop"] }], 80),
  track("t11", "Pink + White", [{ id: "a11", name: "Frank Ocean", genres: ["r&b", "alternative r&b"] }], 86),
  track("t12", "Can't Do Without You", [{ id: "a12", name: "Caribou", genres: ["electronic", "idm"] }], 72),
  track("t13", "Kill Bill", [{ id: "a13", name: "SZA", genres: ["r&b", "neo soul"] }], 89),
  track("t14", "Sprawl II", [{ id: "a14", name: "Arcade Fire", genres: ["indie rock", "art rock"] }], 77),
  track("t15", "Feel Good Inc.", [{ id: "a15", name: "Gorillaz", genres: ["alternative rock", "electronic"] }], 91),
  track("t16", "Space Song", [{ id: "a16", name: "Beach House", genres: ["dream pop", "shoegaze"] }], 78),
  track("t17", "Lite Spots", [{ id: "a17", name: "Kaytranada", genres: ["electronic", "house"] }], 75),
  track("t18", "Bags", [{ id: "a18", name: "Clairo", genres: ["bedroom pop", "indie pop"] }], 83),
  track("t19", "Teardrop", [{ id: "a19", name: "Massive Attack", genres: ["trip hop", "electronic"] }], 84),
  track("t20", "Cranes in the Sky", [{ id: "a20", name: "Solange", genres: ["r&b", "neo soul"] }], 80),
  track("t21", "See You Again", [{ id: "a1", name: "Tyler, The Creator", genres: ["hip hop", "neo soul"] }], 84),
  track("t22", "Creep", [{ id: "a2", name: "Radiohead", genres: ["art rock", "alternative rock"] }], 86),
  track("t23", "Get Lucky", [{ id: "a3", name: "Daft Punk", genres: ["disco", "electronic"] }], 92),
  track("t24", "Savior Complex", [{ id: "a4", name: "Phoebe Bridgers", genres: ["indie folk", "singer-songwriter"] }], 77),
  track("t25", "Alright", [{ id: "a5", name: "Kendrick Lamar", genres: ["hip hop", "conscious hip hop"] }], 88),
  track("t26", "Let It Happen", [{ id: "a6", name: "Tame Impala", genres: ["neo-psychedelia", "psychedelic pop"] }], 85),
  track("t27", "Two Weeks", [{ id: "a7", name: "FKA twigs", genres: ["art pop", "r&b"] }], 73),
  track("t28", "Skinny Love", [{ id: "a8", name: "Bon Iver", genres: ["indie folk", "art pop"] }], 79),
  track("t29", "D.A.N.C.E.", [{ id: "a9", name: "Justice", genres: ["electro", "french house"] }], 81),
  track("t30", "Washing Machine Heart", [{ id: "a10", name: "Mitski", genres: ["indie rock", "singer-songwriter"] }], 82)
];

function daysAgo(n: number, hour = 14, minute = 30): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

/** Deterministic-ish shuffle using index */
function pickTrack(index: number): Track {
  return SAMPLE_TRACKS[index % SAMPLE_TRACKS.length];
}

function buildRecentlyPlayed(): RecentlyPlayedTrack[] {
  const entries: RecentlyPlayedTrack[] = [];
  let idx = 0;

  // Spread plays across ~21 days with varying intensity
  const schedule: { day: number; count: number; startHour: number }[] = [
    { day: 0, count: 4, startHour: 9 },
    { day: 0, count: 3, startHour: 20 },
    { day: 1, count: 2, startHour: 11 },
    { day: 2, count: 5, startHour: 8 },
    { day: 3, count: 1, startHour: 22 },
    { day: 4, count: 3, startHour: 15 },
    { day: 5, count: 6, startHour: 10 },
    { day: 6, count: 4, startHour: 19 },
    { day: 7, count: 2, startHour: 13 },
    { day: 8, count: 3, startHour: 17 },
    { day: 9, count: 1, startHour: 7 },
    { day: 10, count: 4, startHour: 21 },
    { day: 11, count: 5, startHour: 12 },
    { day: 12, count: 2, startHour: 16 },
    { day: 13, count: 3, startHour: 18 },
    { day: 14, count: 7, startHour: 9 },
    { day: 15, count: 2, startHour: 23 },
    { day: 16, count: 4, startHour: 14 },
    { day: 17, count: 1, startHour: 8 },
    { day: 18, count: 3, startHour: 20 },
    { day: 19, count: 5, startHour: 11 },
    { day: 20, count: 2, startHour: 15 }
  ];

  schedule.forEach(({ day, count, startHour }) => {
    for (let i = 0; i < count; i += 1) {
      entries.push({
        playedAt: daysAgo(day, startHour + i * 2, (i * 17) % 60),
        track: pickTrack(idx++)
      });
    }
  });

  return entries.sort((a, b) => b.playedAt.localeCompare(a.playedAt));
}

export function getSampleSourceData() {
  return {
    topArtists: SAMPLE_ARTISTS,
    topTracks: SAMPLE_TRACKS,
    recentlyPlayed: buildRecentlyPlayed()
  };
}

export const SAMPLE_DISPLAY_NAME = "Demo Operator";
