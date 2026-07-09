# Wacky Charts feat. Spotify Data

A Ben 10–themed Spotify listening dashboard. Connect your account, spin the Omnitrix dial, and transform your top artists, genres, and tracks into eight d3.js visualization forms.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- [npm](https://www.npmjs.com/) (comes with Node)
- A [Spotify account](https://www.spotify.com/) — only needed for live data, not the demo page

### 1. Clone and install

```bash
git clone <your-repo-url>
cd wacky-charts-feat-spotify-data   # or whatever you named the folder
npm install
```

### 2. Preview without Spotify (fastest)

You can explore all eight charts immediately with fake data — no API keys required:

```bash
npm run dev
```

Open **http://localhost:3001/sample** in your browser.

The login page at **http://localhost:3001** also has a **“Preview with demo data →”** link.

### 3. Set up Spotify OAuth (for live data)

To connect a real Spotify account and view your own listening stats:

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Log in and click **Create app**.
3. Name it anything (e.g. `Wacky Charts Dev`).
4. Under **Redirect URIs**, add exactly:
   ```text
   http://localhost:3001/api/auth/callback/spotify
   ```
5. Save. Copy the **Client ID** and **Client Secret** from the app settings.

### 4. Configure environment variables

Copy the example env file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in all four values:

```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3001
```

Generate a random `NEXTAUTH_SECRET` (pick one):

```bash
openssl rand -base64 32
```

Or in Node:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

> **Important:** `NEXTAUTH_URL` must match the port the app runs on (`3001`). If you change the port in `package.json`, update this value and your Spotify redirect URI to match.

### 5. Run the app

```bash
npm run dev
```

| URL | What it does |
|-----|----------------|
| http://localhost:3001 | Login page — click **Link Spotify** |
| http://localhost:3001/galaxy | Your live dashboard (requires login) |
| http://localhost:3001/sample | Demo dashboard with fake data |

After logging in with Spotify, you'll land on `/galaxy`.

### 6. Other commands

```bash
npm run typecheck   # TypeScript check
npm run build       # Production build
npm run start       # Run production build (port 3001)
npm run lint        # ESLint
```

## Troubleshooting

**Port already in use**

This project runs on port **3001** by default (not 3000). If 3001 is also taken, change the `-p` flag in `package.json` scripts and update `NEXTAUTH_URL` + your Spotify redirect URI accordingly.

**Spotify login fails / redirect error**

- Confirm the redirect URI in the Spotify Dashboard matches exactly: `http://localhost:3001/api/auth/callback/spotify`
- Confirm `NEXTAUTH_URL=http://localhost:3001` in `.env.local`
- Restart the dev server after changing env vars

**“Invalid client” or empty charts after login**

- Double-check `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in `.env.local`
- Make sure you're editing `.env.local`, not `.env.example`

**No `.env.local` needed for `/sample`**

The demo page at `/sample` works without any env vars. Only `/galaxy` (live Spotify data) requires OAuth setup.

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
