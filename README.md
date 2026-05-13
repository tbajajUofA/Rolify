# Spotify RPG: Your Music Taste Becomes Your Character

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)

> Transform your Spotify listening history into a fully-realized RPG character with stats, class, level, achievements, and daily quests.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Key Features](#key-features)
3. [Prerequisites & Installation](#prerequisites--installation)
4. [Project Architecture & Directory Structure](#project-architecture--directory-structure)
5. [Configuration](#configuration)
6. [Usage Instructions](#usage-instructions)
7. [UI Design System](#ui-design-system)
8. [Character Generation Algorithm](#character-generation-algorithm)
9. [Gemini AI Integration](#gemini-ai-integration)
10. [Testing](#testing)
11. [Deployment](#deployment)
12. [Privacy & Security](#privacy--security)
13. [License](#license)

---

## Introduction

Spotify RPG is a web application that transforms your Spotify listening data into a playable RPG character. By analyzing your top tracks, artists, and audio features, the app generates a unique character with six core stats (Strength, Charisma, Agility, Wisdom, Speed, Focus), assigns you one of nine character classes based on your music genres, calculates your level based on listening diversity, and provides daily quests and achievements to gamify your music discovery journey.

### Key Features

- **OAuth 2.0 Authentication**: Secure Spotify login using PKCE flow
- **Dynamic Character Generation**: Six stats calculated from audio features (energy, valence, danceability, acousticness, tempo, instrumentalness)
- **Nine Character Classes**: Berserker, Sage, Bard, Rogue, Mystic, Enchanter, Ranger, Techromancer, Wildcard
- **Music Insights Dashboard**: Genre distribution, listening diversity score, average tempo, secondary artists
- **Daily Quest System**: Three personalized quests with Spotify recommendations
- **Achievement System**: Five unlockable badges based on listening patterns
- **Shareable Character Cards**: Export your character sheet as PNG
- **Demo Mode**: Four pre-built profiles (Playboi Carti, Sabrina Carpenter, Tyler the Creator, The Weeknd fans)

---

## Prerequisites & Installation

### System Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+
- **Spotify Account**: Free or Premium (required for real data)
- **Spotify Developer Account**: Required for API credentials (optional for demo mode)

### Quick Start (Fresh Clone)

Copy and paste these commands in order.

#### 1. Clone and enter the repo

```bash
git clone <your-repo-url>
cd Rolify
```

#### 2. Install dependencies

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

#### 3. Create env files from templates

```bash
cp .env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

#### 4. Fill required env values

Edit `backend/.env`:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
```

Edit `frontend/.env.local`:

```env
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
```

#### 5. Run the project

```bash
npm run dev
```

Useful optional commands:

```bash
npm run dev:backend
npm run dev:frontend
npm run build
npm run preview
```

Notes:
- Frontend runs on `http://localhost:5173`.
- Backend runs on `http://localhost:3000`.
- Demo mode works without Spotify auth, but real profile generation needs valid API credentials.

---

## Project Architecture & Directory Structure

```
spotify-rpg/
├── public/
├── src/
│   ├── components/
│   │   ├── character/      # Character-specific components
│   │   └── ui/             # shadcn/ui base components
│   ├── lib/                # Business logic and utilities
│   ├── pages/              # Page-level components
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx
│   ├── main.tsx
│   ├── routes.tsx
│   └── index.css
├── .env.example
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

### `/src/components/character/`

#### `AchievementBadge.tsx`
Displays a single achievement badge. Unlocked badges show with primary border/glow; locked badges at 40% opacity with grayscale filter.

**Icon Mapping**: `genre-hopper` → Layers, `high-voltage` → Zap, `melancholy-knight` → CloudRain, `purist` → Music2, `eclectic` → Palette

#### `ClassBadge.tsx`
Displays character class with animated reveal (300ms delay, fade-in + scale, pulsing icon glow).

**Icon Mapping**: Berserker → Swords, Sage → BookOpen, Bard → Music, Rogue → Zap, Mystic → Sparkles, Enchanter → Wand2, Ranger → Target, Techromancer → Cpu, Wildcard → Shuffle

#### `EquippedTrack.tsx`
Displays a single equipped track (Weapon/Armor/Accessory slot) with 64×64px album cover, slot label, track name, and artist. Falls back to Music icon if no cover.

**Props**: `track: SpotifyTrack`, `slot: 'Weapon' | 'Armor' | 'Accessory'`, `slotIcon: React.ReactNode`

#### `MusicInsights.tsx`
Displays genre distribution (top 5 genres with %), listening diversity score, average tempo, and secondary artists (ranked 4–7) linking to Spotify.

**Calculations**:
- **Diversity Score**: `(unique genres / total artists) × 100` — 70%+ = highly diverse, 40–70% = balanced, <40% = focused
- **Average Tempo**: Mean BPM — 140+ = fast, 100–140 = moderate, <100 = relaxed

#### `QuestCard.tsx`
Displays a daily quest with personalized Spotify recommendation based on quest type and character class.

**Recommendation Logic**:
- Discover quests → random artist from top 3
- Listen quests → random track from top 5
- Share quests → user's #1 track
- Fallback: curated Spotify playlist per class (e.g., Berserker → Beast Mode, Sage → Deep Focus, Bard → Acoustic Hits, Rogue → RapCaviar, etc.)

#### `ShareCard.tsx`
Exports character sheet as PNG using `html2canvas`. Opens a dialog preview, then downloads as `spotify-rpg-character.png`.

#### `StatBar.tsx`
Single stat row with animated progress bar. Delay prop staggers six bars (100ms increments). Bar fills via CSS transition (1000ms ease-out) using inline `style={{ width: `${value}%` }}`.

**Props**: `label: string`, `icon: React.ReactNode`, `value: number`, `delay?: number`

---

### `/src/lib/`

#### `character-generator.ts`
Core character generation. Main export is `generateCharacter(name, tracks, artists, audioFeatures)`.

**Exports**: `CharacterStats`, `CharacterClass`, `Alignment`, `Achievement`, `Character` interfaces + all calculation functions.

**`calculateStats(audioFeatures)`**:
```typescript
Strength = average(energy) × 100
Charisma = average(valence) × 100
Agility = average(danceability) × 100
Wisdom = (1 - average(acousticness)) × 100
Speed = (average(tempo) / 200) × 100
Focus = (1 - average(instrumentalness)) × 100
```

**`determineClass(artists)`**: Extracts genres from top 20 artists, counts occurrences, maps to class with most matches. Falls back to Wildcard.

**Genre-to-Class Mapping**:
- metal, hard rock, punk → Berserker
- classical, jazz, blues, folk, acoustic → Sage
- pop, indie, singer-songwriter → Bard
- hip hop, rap, trap → Rogue
- ambient, new age, world → Mystic
- electronic, edm, house, techno → Enchanter
- country, americana, bluegrass → Ranger
- experimental, industrial, synthwave → Techromancer

**`calculateLevel(tracks, artists)`**:
```typescript
finalLevel = min(1 + floor(uniqueTracks/10) + floor(uniqueArtists/5), 10)
```

**`determineAlignment(stats)`**: Based on Charisma ≥/< 50 and Strength ≥/< 50 → Lawful Good / Chaotic Good / Lawful Evil / Chaotic Evil / True Neutral.

**`getAchievements(artists, stats)`**:
1. **Genre Hopper**: 5+ unique genres
2. **High Voltage**: Strength > 80
3. **Melancholy Knight**: Charisma < 30
4. **Purist**: Wisdom > 85
5. **Eclectic**: 10+ unique genres

#### `demo-data.ts`
Four pre-built demo profiles with real Spotify IDs:

| ID | Name | Description | Expected Class |
|----|------|-------------|----------------|
| `carti` | Vamp Slayer | High energy trap/rage rap | Rogue |
| `sabrina` | Pop Princess | Upbeat pop with catchy hooks | Bard |
| `tyler` | Creative Rebel | Alternative hip-hop with soul | Rogue/Wildcard |
| `weeknd` | Night Owl | Dark R&B with atmospheric vibes | Mystic/Rogue |

Each profile includes 10 artists and 50 tracks with realistic audio features.

#### `quests.ts`
Three daily quests with 24-hour localStorage reset (`spotify_rpg_quests` key):
1. **Discover New Artist** — +50 XP
2. **Listen to 10 Songs** — +30 XP
3. **Share Your Favorite** — +20 XP

#### `spotify-api.ts`
Spotify Web API HTTP client. All functions take an access token and throw on non-200 responses.

| Function | Endpoint | Default Params |
|----------|----------|----------------|
| `getUserProfile(token)` | `GET /v1/me` | — |
| `getTopTracks(token, limit, timeRange)` | `GET /v1/me/top/tracks` | 50 tracks, medium_term |
| `getTopArtists(token, limit, timeRange)` | `GET /v1/me/top/artists` | 20 artists, medium_term |
| `getAudioFeatures(token, trackIds)` | `GET /v1/audio-features` | Up to 100 IDs |

#### `spotify-auth.ts`
OAuth 2.0 PKCE authentication flow using Web Crypto API and localStorage.

**PKCE Flow**:
1. Generate 128-char random code verifier
2. SHA-256 hash → base64 URL-safe code challenge
3. Redirect to Spotify authorize endpoint with challenge
4. User authorizes; Spotify redirects with `?code=`
5. Exchange code + verifier for access token
6. Store token in `localStorage` under `spotify_access_token`

**Key Exports**: `redirectToSpotifyAuth()`, `handleSpotifyCallback(code)`, `getAccessToken()`, `clearSpotifyAuth()`, `isSpotifyConfigured()`

**Scopes requested**: `user-read-private user-read-email user-top-read`

#### `utils.ts`
Exports `cn(...inputs)` — merges classNames using `clsx` + `tailwind-merge` to resolve Tailwind conflicts.

---

### `/src/pages/`

#### `CallbackPage.tsx` — Route: `/callback`
Handles OAuth redirect. Extracts `?code=` from URL, calls `handleSpotifyCallback(code)`, navigates to `/character` on success or shows error with retry button.

#### `CharacterSheetPage.tsx` — Route: `/character`
Main character display. Fetches all Spotify data in parallel, generates character, renders full sheet.

**Real Mode Data Flow**: Verify token → fetch profile + tracks (50) + artists (20) in parallel → fetch audio features → `generateCharacter()` → `getQuests()` → render.

**Demo Mode**: Reads `localStorage.demo_mode` and `demo_profile_id`, uses matching `DEMO_PROFILES` entry.

**Layout**:
- Header: name, level, alignment, share/logout buttons
- Row 1: Class badge (1 col) + Stats card (2 cols)
- Full-width: Music Insights → Equipped Tracks (3 cols) → Daily Quests (3 cols) → Achievements (5 cols)
- All grids collapse to single column on mobile

#### `LoginPage.tsx` — Route: `/`
Landing page with Spotify login and demo mode selection.
- Checks `isSpotifyConfigured()` — shows login or setup instructions
- "Try Demo Mode" opens dialog with 4 profile cards; selection sets localStorage and navigates to `/character`

---

### `/src/types/spotify.ts`

```typescript
interface SpotifyUser { id, display_name, email, images }
interface SpotifyImage { url, height?, width? }
interface SpotifyArtist { id, name, genres, images }
interface SpotifyTrack { id, name, artists, album }
interface SpotifyAlbum { name, images }
interface AudioFeatures {
	id, energy, valence, danceability,   // all 0.0–1.0
	acousticness, instrumentalness,       // all 0.0–1.0
	tempo                                 // BPM, typically 50–200
}
```

---

### Root Files

| File | Purpose |
|------|---------|
| `App.tsx` | Forces dark mode, sets up `BrowserRouter` |
| `main.tsx` | Creates React root, mounts App in StrictMode |
| `routes.tsx` | `/` → LoginPage, `/callback` → CallbackPage, `/character` → CharacterSheetPage, `*` → redirect to `/` |
| `index.css` | CSS tokens, Tailwind directives, custom animations (`fill-bar`, `reveal`, `glow-pulse`), utility classes (`.glow-text`, `.glow-border`, `.gradient-text`) |

---

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SPOTIFY_CLIENT_ID` | Yes (real mode) | Client ID from Spotify Developer Dashboard |
| `VITE_SPOTIFY_REDIRECT_URI` | Yes (real mode) | OAuth callback URL — must match Spotify app settings |

Never commit `.env` to version control. Update redirect URI for production deployments.

### Other Config Files

- **`tailwind.config.js`**: Maps CSS custom properties to Tailwind theme, adds `tailwindcss-animate` plugin
- **`tsconfig.json`**: `strict: true`, `@/` path alias → `./src`, `jsx: \"react-jsx\"`
- **`vite.config.ts`**: React plugin, `@` → `./src` alias, default port 5173

### Design Tokens (Dark Mode)

```css
--background: 20 14.3% 4.1%;    /* Deep dark brown */
--foreground: 0 0% 95%;         /* Off-white */
--primary: 142 70% 45%;         /* Bright green */
--card: 24 9.8% 10%;            /* Dark card */
--border: 240 3.7% 15.9%;       /* Dark border */
```

**Typography**: Cinzel (headings, fantasy serif) + Inter (body, sans-serif)

---

## Usage Instructions

```bash
npm run dev      # Start dev server at http://localhost:5173
npm run build    # Production build → dist/
npm run preview  # Preview production build
```

**Real Data**: Configure `.env` → `npm run dev` → "Login with Spotify" → authorize → view character.

**Demo Mode**: `npm run dev` → "Try Demo Mode" → select profile → view character.

---

## Character Generation Algorithm

### Input
- Top 50 tracks (medium-term)
- Top 20 artists (medium-term)
- Audio features for all tracks

### Stat Calculation
```typescript
Strength = average(energy) × 100          // Energy/intensity
Charisma = average(valence) × 100         // Happiness/positivity
Agility  = average(danceability) × 100    // Rhythm/danceability
Wisdom   = (1 - average(acousticness)) × 100   // Production complexity
Speed    = (average(tempo) / 200) × 100   // Normalized tempo
Focus    = (1 - average(instrumentalness)) × 100  // Vocal presence
```

### Level Formula
```typescript
finalLevel = min(1 + floor(uniqueTracks/10) + floor(uniqueArtists/5), 10)
// Max level 10: +5 from tracks, +4 from artists
```

### Alignment
| Charisma | Strength | Alignment |
|----------|----------|-----------|
| ≥ 50 | ≥ 50 | Lawful Good |
| ≥ 50 | < 50 | Chaotic Good |
| < 50 | ≥ 50 | Lawful Evil |
| < 50 | < 50 | Chaotic Evil |
| — | — | True Neutral |

---

## Gemini AI Integration

Gemini is used to generate all natural-language content in the app — character names, backstories, class flavor text, quest descriptions, and achievement descriptions — based on the user's computed stats and music data. All calls are made server-side through a backend/serverless function so the API key is never exposed to the client.

### API Choice

Two options are supported; pick one based on your deployment context:

| Option | Best For | Key Env Var |
|--------|----------|-------------|
| **Google AI Studio** (`generativelanguage.googleapis.com`) | Local dev, quick prototyping, free tier | `GEMINI_API_KEY` |
| **Vertex AI** (`us-central1-aiplatform.googleapis.com`) | Production, GCP infrastructure, IAM auth | GCP service account / ADC |

Both use the same `gemini-1.5-flash` model and identical prompt structure. To switch, only the base URL and auth header change — the request/response schema is the same.

---

### Architecture

```
Client (React)
		│
		│  POST /api/generate-character   { stats, class, genres, topArtists, topTracks }
		▼
Serverless Function (e.g. Vercel /api, Netlify Function, Cloud Function)
		│
		│  POST https://<gemini-endpoint>/v1/models/gemini-1.5-flash:generateContent
		▼
Gemini API
		│
		│  { name, description, classFlavorText, quests[], achievements[] }
		▼
Client renders generated content
```

The client sends a single payload after `generateCharacter()` runs. The function calls Gemini once with all generation tasks bundled in one prompt (to minimize latency and API calls), then returns structured JSON.

---

### Environment Variables

Add these to your serverless environment (not the Vite `.env` — these must stay server-side):

```env
# Google AI Studio
GEMINI_API_KEY=your_api_key_here
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent

# Vertex AI (alternative)
# GEMINI_API_URL=https://us-central1-aiplatform.googleapis.com/v1/projects/{PROJECT_ID}/locations/us-central1/publishers/google/models/gemini-1.5-flash:generateContent
# GOOGLE_CLOUD_PROJECT=your_gcp_project_id
```

---

### Serverless Function

**File**: `/api/generate-character.ts` (or `.js`)

**Method**: `POST`

**Request body**:
```typescript
{
	stats: CharacterStats,        // { strength, charisma, agility, wisdom, speed, focus }
	characterClass: string,       // e.g. "Rogue"
	alignment: string,            // e.g. "Chaotic Good"
	level: number,                // 1–10
	topGenres: string[],          // top 5 genres
	topArtists: string[],         // top 5 artist names
	topTracks: string[],          // top 5 track names
}
```

**Response body**:
```typescript
{
	name: string,                 // e.g. "Vex the Hollow Beat"
	description: string,          // 2–3 sentence character backstory
	classFlavorText: string,      // 1 sentence flavor for the assigned class
	quests: {
		title: string,
		description: string,
	}[],                          // exactly 3 quests
	achievements: {
		id: string,                 // matches existing achievement IDs
		description: string,        // flavored unlock description
	}[],                          // one per unlocked achievement
}
```

**Function skeleton**:
```typescript
export async function POST(req: Request) {
	const body = await req.json();
	const { stats, characterClass, alignment, level, topGenres, topArtists, topTracks } = body;

	const prompt = buildPrompt({ stats, characterClass, alignment, level, topGenres, topArtists, topTracks });

	const response = await fetch(process.env.GEMINI_API_URL!, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-goog-api-key": process.env.GEMINI_API_KEY!, // omit for Vertex AI (use ADC)
		},
		body: JSON.stringify({
			contents: [{ role: "user", parts: [{ text: prompt }] }],
			generationConfig: { responseMimeType: "application/json", temperature: 0.9 },
		}),
	});

	const data = await response.json();
	const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
	return Response.json(JSON.parse(text));
}
```

> **Vertex AI auth**: Replace the `x-goog-api-key` header with a Bearer token from Application Default Credentials (ADC). Use the `google-auth-library` package: `const client = new GoogleAuth({ scopes: "https://www.googleapis.com/auth/cloud-platform" }); const token = await client.getAccessToken();`

---

### Prompt Design

All five generation tasks are bundled into one structured prompt. Gemini is instructed to return only valid JSON — no markdown fences, no preamble.

```typescript
function buildPrompt(input): string {
	return `
You are a creative RPG narrator. Given a player's music-derived character data, generate the following.
Return ONLY valid JSON matching the schema below — no markdown, no explanation.

CHARACTER DATA:
- Class: ${input.characterClass}
- Alignment: ${input.alignment}
- Level: ${input.level}
- Top Genres: ${input.topGenres.join(", ")}
- Top Artists: ${input.topArtists.join(", ")}
- Top Tracks: ${input.topTracks.join(", ")}
- Stats: Strength ${input.stats.strength}, Charisma ${input.stats.charisma},
	Agility ${input.stats.agility}, Wisdom ${input.stats.wisdom},
	Speed ${input.stats.speed}, Focus ${input.stats.focus}

OUTPUT SCHEMA:
{
	"name": "string — a creative RPG name that reflects the genres and energy above (max 5 words)",
	"description": "string — 2–3 sentences of character backstory rooted in the music taste",
	"classFlavorText": "string — one evocative sentence describing this character's class expression",
	"quests": [
		{ "title": "string", "description": "string — 1 sentence, music-themed quest" },
		{ "title": "string", "description": "string" },
		{ "title": "string", "description": "string" }
	],
	"achievements": [
		{ "id": "string — one of: genre-hopper, high-voltage, melancholy-knight, purist, eclectic",
			"description": "string — flavored 1-sentence unlock description" }
	]
}

Only include achievements that are actually unlocked (you will receive the list below).
Unlocked achievement IDs: ${input.unlockedAchievementIds.join(", ")}
`;
}
```

**Prompt guidelines**:
- `temperature: 0.9` — high enough for creative variety, low enough to stay coherent
- `responseMimeType: "application/json"` — enforces structured output natively (AI Studio) or use the schema field on Vertex AI
- Keep artist/track names in the prompt to anchor the flavor text to real listening data
- If Gemini returns malformed JSON, fall back to the deterministic values from `character-generator.ts`

---

### Client Integration

After `generateCharacter()` resolves, the client fires one request to the serverless function and merges the AI-generated fields into the character state:

```typescript
// In CharacterSheetPage.tsx, after generateCharacter() call:
const aiContent = await fetch("/api/generate-character", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		stats: character.stats,
		characterClass: character.class.name,
		alignment: character.alignment,
		level: character.level,
		topGenres: insights.topGenres,
		topArtists: topArtists.slice(0, 5).map(a => a.name),
		topTracks: topTracks.slice(0, 5).map(t => t.name),
		unlockedAchievementIds: character.achievements
			.filter(a => a.unlocked)
			.map(a => a.id),
	}),
}).then(r => r.json());

setCharacter(prev => ({
	...prev,
	name: aiContent.name,
	description: aiContent.description,
	class: { ...prev.class, flavorText: aiContent.classFlavorText },
	achievements: prev.achievements.map(a => {
		const ai = aiContent.achievements.find(x => x.id === a.id);
		return ai ? { ...a, description: ai.description } : a;
	}),
}));
setQuests(aiContent.quests);
```

The request should be made in a non-blocking way — render the deterministic character first, then update with AI content when it resolves, to avoid the page feeling slow.

---

### `/src/lib/gemini.ts` (Recommended Helper)

Centralise the client-side fetch in a dedicated module:

**Key Exports**:
- `GeminiCharacterContent` interface (mirrors the API response shape)
- `fetchGeminiContent(payload): Promise<GeminiCharacterContent>` — wraps the POST, handles errors, returns fallback values on failure

**Error Handling**:
- Non-2xx response → log and return `null` (caller uses deterministic fallback)
- JSON parse failure → same fallback
- Network timeout → abort after 10s with `AbortController`

---

### Adding to the Directory Structure

```
src/
└── lib/
		└── gemini.ts        # Client-side fetch helper for /api/generate-character
api/
└── generate-character.ts  # Serverless function (Vercel/Netlify/Cloud Functions)
```

---

## Testing

### Manual Testing Checklist

- [ ] Authentication flow (login → callback → character page)
- [ ] Character generation (stats, class, level, alignment, achievements)
- [ ] Demo mode (all 4 profiles load correctly)
- [ ] Music insights (genres, diversity score, tempo, secondary artists)
- [ ] Quest system (loads, persists, resets after 24h)
- [ ] Share functionality (PNG export downloads correctly)
- [ ] Responsive design (mobile single-column collapse)

---

## Deployment

1. Set production environment variables (update `VITE_SPOTIFY_REDIRECT_URI` to your domain)
2. Add production redirect URI to Spotify Developer Dashboard
3. Run `npm run build`
4. Deploy `dist/` to any static host (Vercel, Netlify, GitHub Pages, etc.)

---

## Privacy & Security

- **Client-side only**: All processing in the browser — no backend, no database
- **Spotify token**: Stored in `localStorage`, expires after 1 hour, cleared on logout
- **PKCE**: No client secret exposed; protects against authorization code interception
- **Demo mode**: Uses pre-generated sample data — no real Spotify data accessed

---

## Acknowledgments

Spotify Web API · shadcn/ui · Tailwind CSS · Lucide React · Vite · React · TypeScript

remember to edit the readme and gitignore accordingly
