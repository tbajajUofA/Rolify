# Rolify / Spotify RPG - Agent Guide

## 🎯 Project Overview

**Rolify** is a Spotify-to-RPG app. It turns listening history into a generated personality profile with stats, archetype, and a short verdict.

Current direction:
- public REST endpoints live in `backend/api/`
- reusable backend logic lives in `backend/services/`
- the frontend calls backend endpoints instead of hitting Spotify directly
- the character page now requests generated profiles for `long_term`, `medium_term`, and `short_term`

---

## 📁 Folder Structure

```
Rolify/
├── backend/                    # Express.js backend
│   ├── server.ts              # Entry point that mounts API routers
│   ├── api/                   # Public HTTP endpoints
│   │   ├── auth.ts            # /api/auth/exchange, /refresh, /logout
│   │   ├── spotify.ts         # Spotify data endpoints used by the frontend and character flow
│   │   └── character.ts       # Gemini-backed profile generation endpoint
│   └── services/              # Internal backend-only logic
│       ├── spotify.ts         # Spotify request helpers and response shaping
│       ├── gemini.ts          # Gemini request + JSON parsing helpers
│       └── character.ts       # Orchestrates Spotify + Gemini into one profile
├── frontend/                   # React + TypeScript + Vite frontend
│   ├── package.json           # Frontend dependencies (React, Vite, Tailwind, TypeScript)
│   ├── tsconfig.json          # TypeScript configuration
│   ├── tailwind.config.ts      # Tailwind CSS configuration
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
- Express.js HTTP server
- Spotify OAuth PKCE exchange and refresh flow
- Spotify Web API requests handled server-side
- Gemini personality generation handled server-side
- HTTP-only cookies for token storage

**Frontend:**
- React 18.2.0 (UI framework)
- TypeScript 5.6.0 (type safety)
- Vite 6.0 (build tool)
- React Router DOM 6.14 (routing)
- Tailwind CSS 3.4.0 (styling)

### Project Type
- Monorepo with separate frontend and backend
- Frontend runs on `http://localhost:5173` and proxies `/api` to the backend
- Backend runs on `http://localhost:3000`
- Root `npm run dev` starts both sides together

---

## 🔑 Key Features

### 1. **Spotify OAuth Authentication**
  - **Flow**: OAuth 2.0 with PKCE (Proof Key for Code Exchange)
  - **Location**: [backend/api/auth.ts](backend/api/auth.ts), [frontend/src/lib/spotify-auth.ts](frontend/src/lib/spotify-auth.ts)
  - **Endpoints**: `/api/auth/exchange`, `/api/auth/refresh`, `/api/auth/logout`
  - **Tokens**: Stored as HTTP-only cookies

### 2. **Character Generation Pipeline**
   - **Location**: [backend/api/character.ts](backend/api/character.ts), [backend/services/character.ts](backend/services/character.ts)
   - **Input**: `time_range` plus Spotify data fetched server-side
   - **Output**: Gemini-generated profile with:
     - archetype
     - 5 personality stats
     - verdict
     - source data bundle for debugging

### 3. **Spotify API Integration**
   - **Location**: [backend/api/spotify.ts](backend/api/spotify.ts), [backend/services/spotify.ts](backend/services/spotify.ts)
   - **Key Endpoints**:
     - `GET /api/spotify/me`
     - `GET /api/spotify/top-tracks?time_range=...`
     - `GET /api/spotify/top-artists?time_range=...`
     - `GET /api/spotify/audio-features?time_range=...`
     - `GET /api/spotify/followed-artists`
     - `GET /api/spotify/playlists`

### 4. **Pages & Routes**
  - **LoginPage**: Initial Spotify authentication screen and demo entry points
  - **CallbackPage**: Handles OAuth redirect after Spotify login
  - **CharacterSheetPage**: Requests backend-generated character profiles and lets the user switch time ranges

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
8. **Backend stores tokens in HTTP-only cookies**
9. **Frontend redirected to CharacterSheetPage**
10. **CharacterSheetPage calls `POST /api/character/generate` with a time range**
11. **Backend fetches Spotify data, builds a Gemini prompt, and returns the generated profile**

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
cd <repo-root>
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
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
PORT=3000
NODE_ENV=development
```

**Frontend** (`.env.local`):
```
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
# Optional if the frontend ever needs to call the backend from a different origin
VITE_API_BASE_URL=http://localhost:3000
```

---

## 🎨 UI & Styling

- **CSS Framework**: Tailwind CSS (utility-first)
- **Global Styles**: [frontend/src/index.css](frontend/src/index.css)
- **Config**: [frontend/tailwind.config.ts](frontend/tailwind.config.ts)
- **Current UI Direction**: simple card-based layout with backend-generated stats and a time-range selector

---

## 🔗 Important Files Reference

| File | Purpose |
|------|---------|
| [backend/server.ts](backend/server.ts) | Express server that mounts API routers |
| [backend/api/auth.ts](backend/api/auth.ts) | OAuth exchange, refresh, logout |
| [backend/api/spotify.ts](backend/api/spotify.ts) | Spotify REST endpoints for the app |
| [backend/api/character.ts](backend/api/character.ts) | Gemini personality generation endpoint |
| [backend/services/spotify.ts](backend/services/spotify.ts) | Internal Spotify request helpers |
| [backend/services/gemini.ts](backend/services/gemini.ts) | Internal Gemini request/parsing helpers |
| [backend/services/character.ts](backend/services/character.ts) | Orchestrates Spotify + Gemini into one profile |
| [frontend/src/App.tsx](frontend/src/App.tsx) | Main React component, routing setup |
| [frontend/src/lib/character-generator.ts](frontend/src/lib/character-generator.ts) | Legacy local stat helpers; backend now owns generation |
| [frontend/src/lib/spotify-auth.ts](frontend/src/lib/spotify-auth.ts) | OAuth 2.0 PKCE implementation |
| [frontend/src/lib/spotify-api.ts](frontend/src/lib/spotify-api.ts) | Spotify API wrapper functions |
| [frontend/src/lib/demo-data.ts](frontend/src/lib/demo-data.ts) | Pre-built demo characters |
| [frontend/src/types/spotify.ts](frontend/src/types/spotify.ts) | TypeScript interfaces for Spotify data |
| [frontend/src/pages/LoginPage.tsx](frontend/src/pages/LoginPage.tsx) | Login UI |
| [frontend/src/pages/CallbackPage.tsx](frontend/src/pages/CallbackPage.tsx) | OAuth callback handler |
| [frontend/src/pages/CharacterSheetPage.tsx](frontend/src/pages/CharacterSheetPage.tsx) | Main dashboard UI |

---

## 📝 Common Tasks for Future Agents

### Adjust Character Generation
- Edit [backend/services/character.ts](backend/services/character.ts)
- Update the prompt, fallback stats, or time-range handling
- If the Gemini response shape changes, update [backend/services/gemini.ts](backend/services/gemini.ts)

### Add Demo Characters
- Edit [frontend/src/lib/demo-data.ts](frontend/src/lib/demo-data.ts)
- Create new pre-built character profile objects

### Change UI Design/Components
- Edit [frontend/src/pages/CharacterSheetPage.tsx](frontend/src/pages/CharacterSheetPage.tsx) for generated profile display and time-range controls
- Edit [frontend/src/pages/LoginPage.tsx](frontend/src/pages/LoginPage.tsx) for login screen
- Update Tailwind classes in these files

### Debug API Issues
- Check [backend/server.ts](backend/server.ts) for router mounting
- Check [backend/api/auth.ts](backend/api/auth.ts) for token flow
- Check [backend/api/spotify.ts](backend/api/spotify.ts) for Spotify response shapes
- Check [backend/api/character.ts](backend/api/character.ts) and [backend/services/character.ts](backend/services/character.ts) for profile generation
- Check [frontend/src/lib/spotify-api.ts](frontend/src/lib/spotify-api.ts) for API call logic
- Verify environment variables are set correctly

### Add New Spotify Data
- Extend API calls in [backend/services/spotify.ts](backend/services/spotify.ts)
- Update TypeScript interfaces in [frontend/src/types/spotify.ts](frontend/src/types/spotify.ts)
- Integrate new data into character generation in [backend/services/character.ts](backend/services/character.ts)

---

## 🛡️ Security Notes

- **Tokens**: Stored in HTTP-only cookies (secure, not exposed to JavaScript)
- **PKCE Flow**: Prevents authorization code interception attacks
- **Same-Site Cookies**: Protects against CSRF attacks
- **Gemini API Key**: Stays on the backend only
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

1. **Check whether the task is backend or frontend** before editing anything.
2. **Use `backend/api/` for HTTP route changes** and `backend/services/` for reusable logic.
3. **Use `frontend/src/lib/spotify-api.ts`** for client fetch wrappers only.
4. **Use `backend/services/character.ts`** if the generated personality rules need to change.
5. **Use `frontend/src/pages/CharacterSheetPage.tsx`** if the UI needs to show more or less of the generated profile.

---

*Last Updated: May 12, 2026*
*Project: Rolify / Spotify RPG*
