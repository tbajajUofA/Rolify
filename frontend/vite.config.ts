/**
 * Vite config.
 *
 * Purpose:
 * - Sets up the @ alias used throughout src/.
 * - Proxies /api requests to the backend on port 3000 during development.
 *
 * Cross references:
 * - frontend/src/lib/spotify-api.ts
 * - backend/server.js
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // React plugin enables TSX/JSX support.
  plugins: [react()],
  resolve: {
    // Allow imports like `@/lib/spotify-api`.
    alias: [{ find: '@', replacement: '/src' }]
  },
  server: {
    // Development proxy so the frontend can call the backend with relative /api paths.
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})
