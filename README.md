# Wacky Charts feat. Spotify Data

A Ben 10–themed Spotify listening dashboard. Connect your account, spin the Omnitrix dial, and transform your top artists, genres, and tracks into eight d3.js visualization forms.

## Pages

- `/` — Spotify login
- `/galaxy` — authenticated dashboard (live Spotify data)
- `/sample` — demo dashboard with fake data (no login required)

## Charts

Each view is an "alien form" on the Omnitrix dial:

| Form | Chart |
|------|-------|
| Overflow | Bubble chart — top artists by play weight, colored by genre |
| Echo Echo | Radar chart — top 5 genre axes |
| Upgrade | Sankey diagram — Genre → Artist → Track |
| Chromastone | Chord diagram — genre co-occurrence |
| Big Chill | Streamgraph — genre volume over time |
| Heatblast | Calendar heatmap — daily listening intensity |
| Stinkfly | Beeswarm — tracks by tempo × popularity |
| Wildmutt | Voronoi — artist territory by play count |

## Stack

- Next.js 14 App Router + NextAuth (Spotify OAuth)
- d3.js for all charts
- Framer Motion for dial transitions
- Tailwind CSS + Omnitrix green / black theme

## Environment

Copy `.env.example` to `.env.local` and fill in:

```env
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3001
```

The Spotify app callback URL should be:

```text
http://localhost:3001/api/auth/callback/spotify
```

## Commands

```bash
npm install
npm run dev      # http://localhost:3001
npm run typecheck
npm run build
```

## Spotify API

Uses supported endpoints only:

- `/me`
- `/me/top/artists`
- `/me/top/tracks`
- `/me/player/recently-played`

Does not call deprecated audio-features or audio-analysis endpoints. Tempo/popularity values for the beeswarm chart use deterministic synthetic features derived from track IDs and artist genres.

## Project layout

```
app/              Next.js routes (/, /galaxy, /sample)
components/       Omnitrix dial, dashboard, d3 chart components
lib/              Spotify client, auth, transformData pipeline
```
