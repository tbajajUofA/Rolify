# your music universe

A bold Spotify-green galaxy visualizer built with Next.js App Router, Auth.js, Three.js, Framer Motion, and Chart.js.

## Pages

- `/` - Spotify login page with a drifting starfield and control-panel connect button.
- `/galaxy` - authenticated long-scroll visualization page with 3D scenes, charts, and Spotify listening data.

## Environment

Copy `.env.example` to `.env.local` and fill in:

```env
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

The Spotify app callback URL should be:

```text
http://localhost:3000/api/auth/callback/spotify
```

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

## Spotify API Notes

This app uses supported endpoints only:

- `/me`
- `/me/top/artists`
- `/me/top/tracks`
- `/me/player/recently-played`

It does not call Spotify's deprecated audio-features, audio-analysis, recommendations, or related-artists endpoints. Audio feature values are deterministic synthetic values derived from track IDs and artist genres.
