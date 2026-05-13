/**
 * Frontend bootstrap entry.
 *
 * Purpose:
 * - Finds the root DOM node.
 * - Mounts the React app.
 * - Pulls in global Tailwind and theme styles from index.css.
 *
 * Cross references:
 * - App routes: src/App.tsx
 * - Global theme/styling: src/index.css
 */
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// React 18 root mount point.
const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
