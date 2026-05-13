# Rolify / Spotify RPG - Project Documentation

## 🎯 Project Overview

**Rolify** (also called "Spotify RPG") is a web application that transforms your Spotify listening history into a playable RPG character. The app analyzes your music data and generates a unique character with stats, class, level, achievements, and daily quests based on your listening patterns.

**Core Concept**: Your music taste becomes your character stats and class.

---

## 📁 Folder Structure

```
/home/tj/Rolify/
├── backend/                    # Express.js server (Node.js)
│   ├── package.json           # Backend dependencies (express, dotenv, cookie-parser)
│   └── server.js              # Main backend server - handles Spotify OAuth & API requests
├── frontend/                   # React + TypeScript + Vite frontend
│   ├── package.json           # Frontend dependencies (React, Vite, Tailwind, TypeScript)
│   ├── tsconfig.json          # TypeScript configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── vite.config.ts          # Vite bundler configuration
│   ├── index.html             # HTML entry point
│   └── src/
│       ├── main.tsx           # React app entry point
│       ├── index.css           # Global styles
│       ├── App.tsx            # Main App component
│       ├── lib/               # Utility libraries
│       │   ├── character-generator.ts    # Algorithm to generate RPG character from Spotify data
│       │   ├── demo-data.ts              # Pre-built demo characters (Playboi Carti, Sabrina Carpenter, etc.)
│       │   ├── spotify-api.ts            # Spotify API wrapper functions
│       │   └── spotify-auth.ts           # OAuth 2.0 authentication logic (PKCE flow)
│       ├── pages/             # React page components
│       │   ├── LoginPage.tsx              # Spotify login screen
│       │   ├── CallbackPage.tsx           # OAuth callback handler
│       │   └── CharacterSheetPage.tsx     # Main character display & RPG dashboard
│       └── types/
│           └── spotify.ts      # TypeScript interfaces for Spotify API data
├── package.json               # Root package.json with monorepo scripts
├── README.md                  # Detailed project documentation
└── LICENSE                    # MIT License
```

---

## 🏗️ Architecture

### Technology Stack

**Backend:**
- Express.js (HTTP server)
- Node.js (18.0.0+)
- Spotify Web API
- OAuth 2.0 PKCE Flow
- HTTP-only cookies for token storage

**Frontend:**
- React 18.2.0 (UI framework)
- TypeScript 5.6.0 (type safety)
- Vite 6.0 (build tool)
- React Router DOM 6.14 (routing)
- Tailwind CSS 3.4.0 (styling)

### Project Type
- **Monorepo** structure with separate backend and frontend
- Frontend runs on `http://localhost:5173` (Vite dev server)
- Backend runs on `http://localhost:3000` (Express server)
- Both can run together with `npm run dev` (uses concurrently)

---

## 🔑 Key Features

### 1. **Spotify OAuth Authentication**
   - **Flow**: OAuth 2.0 with PKCE (Proof Key for Code Exchange)
   - **Location**: [backend/server.js](backend/server.js), [frontend/src/lib/spotify-auth.ts](frontend/src/lib/spotify-auth.ts)
   - **Endpoint**: `/api/auth/exchange` (POST) - exchanges auth code for tokens
   - **Tokens**: Stored as HTTP-only cookies for security

### 2. **Character Generation Algorithm**
   - **Location**: [frontend/src/lib/character-generator.ts](frontend/src/lib/character-generator.ts)
   - **Input**: User's top tracks + audio features from Spotify API
   - **Output**: RPG character with:
     - **Six Core Stats** (0-100):
       - `Strength`: Based on audio energy
       - `Charisma`: Based on valence (happiness/positivity of music)
       - `Agility`: Based on danceability
       - `Wisdom`: Based on acousticness
       - `Speed`: Based on tempo
       - `Focus`: Based on instrumentalness
     - **Character Class**: One of 9 classes (Berserker, Sage, Bard, Rogue, Mystic, Enchanter, Ranger, Techromancer, Wildcard)
     - **Level**: Calculated from listening diversity
     - **Achievements**: Badges based on listening patterns
     - **Daily Quests**: Three personalized quests with Spotify recommendations

### 3. **Spotify API Integration**
   - **Location**: [frontend/src/lib/spotify-api.ts](frontend/src/lib/spotify-api.ts)
   - **Key Endpoints Used**:
     - `GET /v1/me` - Get current user profile
     - `GET /v1/me/top/tracks` - Get user's top tracks
     - `GET /v1/me/top/artists` - Get user's top artists
     - `GET /v1/audio-features/{id}` - Get audio features for tracks
     - `GET /v1/recommendations` - Get music recommendations

### 4. **Pages & Routes**
   - **LoginPage**: Initial Spotify authentication screen
   - **CallbackPage**: Handles OAuth redirect after Spotify login
   - **CharacterSheetPage**: Main dashboard showing:
     - Character card with avatar, name, class, level
     - Six stats (Strength, Charisma, Agility, Wisdom, Speed, Focus)
     - Music insights (genres, artists, average tempo, etc.)
     - Daily quests
     - Achievements
     - Export character sheet as PNG

### 5. **Demo Mode**
   - **Location**: [frontend/src/lib/demo-data.ts](frontend/src/lib/demo-data.ts)
   - **Pre-built Characters**:
     - Playboi Carti fan profile
     - Sabrina Carpenter fan profile
     - Tyler the Creator fan profile
     - The Weeknd fan profile
   - **Purpose**: Users can explore the app without Spotify login

---

## 🔐 Authentication Flow

1. **User clicks "Login with Spotify"** on LoginPage
2. **Frontend generates PKCE codes** (code_challenge & code_verifier)
3. **Frontend redirects to Spotify's OAuth endpoint** with code_challenge
4. **User logs in to Spotify** and authorizes app
5. **Spotify redirects back to CallbackPage** with authorization code
6. **CallbackPage sends code + code_verifier to backend** (`POST /api/auth/exchange`)
7. **Backend exchanges code for access_token + refresh_token**
8. **Backend stores tokens in HTTP-only cookies** (secure, not accessible to JavaScript)
9. **Frontend redirected to CharacterSheetPage**
10. **Frontend can now make Spotify API requests** (tokens in cookies automatically sent)

---

## 📊 Data Types

**Key TypeScript Interfaces** in [frontend/src/types/spotify.ts](frontend/src/types/spotify.ts):
```typescript
SpotifyUser          // { id, display_name, email, images }
SpotifyArtist        // { id, name, genres, images }
SpotifyTrack         // { id, name, artists, album }
SpotifyAlbum         // { id, name, images }
AudioFeatures        // { id, energy, valence, danceability, acousticness, instrumentalness, tempo }
SpotifyImage         // { url, height, width }
```

---

## 🚀 Getting Started

### Install Dependencies
```bash
cd /home/tj/Rolify
npm install              # Install root dependencies
npm install --prefix backend
npm install --prefix frontend
```

### Run Development Server
```bash
npm run dev              # Runs both frontend & backend concurrently
# OR separately:
npm run dev:frontend     # Frontend only (port 5173)
npm run dev:backend      # Backend only (port 3000)
```

### Build for Production
```bash
npm run build            # Builds frontend for production
npm run preview          # Preview production build
```

### Environment Variables

**Backend** (`.env`):
```
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
PORT=3000
NODE_ENV=development
```

**Frontend** (`.env.local`):
```
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
```

---

## 🎨 UI & Styling

- **CSS Framework**: Tailwind CSS (utility-first)
- **Global Styles**: [frontend/src/index.css](frontend/src/index.css)
- **Config**: [frontend/tailwind.config.js](frontend/tailwind.config.js)
- **Design System**: Modern RPG-themed card-based UI with gradient backgrounds, shadows, and smooth animations

---

## 🔗 Important Files Reference

| File | Purpose |
|------|---------|
| [backend/server.js](backend/server.js) | Express server, OAuth exchange endpoint, Spotify API proxy |
| [frontend/src/App.tsx](frontend/src/App.tsx) | Main React component, routing setup |
| [frontend/src/lib/character-generator.ts](frontend/src/lib/character-generator.ts) | Algorithm to generate RPG stats from music data |
| [frontend/src/lib/spotify-auth.ts](frontend/src/lib/spotify-auth.ts) | OAuth 2.0 PKCE implementation |
| [frontend/src/lib/spotify-api.ts](frontend/src/lib/spotify-api.ts) | Spotify API wrapper functions |
| [frontend/src/lib/demo-data.ts](frontend/src/lib/demo-data.ts) | Pre-built demo characters |
| [frontend/src/types/spotify.ts](frontend/src/types/spotify.ts) | TypeScript interfaces for Spotify data |
| [frontend/src/pages/LoginPage.tsx](frontend/src/pages/LoginPage.tsx) | Login UI |
| [frontend/src/pages/CallbackPage.tsx](frontend/src/pages/CallbackPage.tsx) | OAuth callback handler |
| [frontend/src/pages/CharacterSheetPage.tsx](frontend/src/pages/CharacterSheetPage.tsx) | Main dashboard UI |

---

## 📝 Common Tasks for Future Agents

### Add a New Character Class
- Edit [frontend/src/lib/character-generator.ts](frontend/src/lib/character-generator.ts)
- Add class name to the 9 existing classes
- Define stat thresholds that determine which class a character gets

### Modify RPG Stats Calculation
- Edit [frontend/src/lib/character-generator.ts](frontend/src/lib/character-generator.ts)
- Adjust how audio features (energy, valence, danceability, etc.) map to stats
- Consider the range (0-100) and weighting logic

### Add Demo Characters
- Edit [frontend/src/lib/demo-data.ts](frontend/src/lib/demo-data.ts)
- Create new pre-built character profile objects

### Change UI Design/Components
- Edit [frontend/src/pages/CharacterSheetPage.tsx](frontend/src/pages/CharacterSheetPage.tsx) for character display
- Edit [frontend/src/pages/LoginPage.tsx](frontend/src/pages/LoginPage.tsx) for login screen
- Update Tailwind classes in these files

### Debug API Issues
- Check [backend/server.js](backend/server.js) for endpoint issues
- Check [frontend/src/lib/spotify-api.ts](frontend/src/lib/spotify-api.ts) for API call logic
- Verify environment variables are set correctly

### Add New Spotify Data
- Extend API calls in [frontend/src/lib/spotify-api.ts](frontend/src/lib/spotify-api.ts)
- Update TypeScript interfaces in [frontend/src/types/spotify.ts](frontend/src/types/spotify.ts)
- Integrate new data into character generation in [frontend/src/lib/character-generator.ts](frontend/src/lib/character-generator.ts)

---

## 🛡️ Security Notes

- **Tokens**: Stored in HTTP-only cookies (secure, not exposed to JavaScript)
- **PKCE Flow**: Prevents authorization code interception attacks
- **Same-Site Cookies**: Protects against CSRF attacks
- **Production**: Uses secure cookies with HTTPS only when `NODE_ENV=production`

---

## 📚 Version Info

- **React**: 18.2.0
- **TypeScript**: 5.6.0
- **Vite**: 6.0
- **Express**: 4.18.2
- **Node.js**: 18.0.0+ required
- **Tailwind CSS**: 3.4.0

---

## 🎯 Next Steps for Agents

1. **Understand the authentication flow** - How users log in via Spotify
2. **Review character generation logic** - How stats and classes are calculated
3. **Explore the page components** - UI structure for each section
4. **Check the type definitions** - Understand data structures
5. **Locate the specific file** you need to edit based on your task

---

*Last Updated: May 12, 2026*
*Project: Rolify / Spotify RPG*
*Contact: Use this document for project navigation and understanding*
