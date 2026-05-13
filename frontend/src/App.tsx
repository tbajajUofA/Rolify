/**
 * Frontend routing shell.
 *
 * Purpose:
 * - Defines the application routes.
 * - Connects the landing page, OAuth callback page, and character page.
 *
 * Cross references:
 * - Login flow starts in src/pages/LoginPage.tsx
 * - Spotify callback is handled in src/pages/CallbackPage.tsx
 * - Generated profile display lives in src/pages/CharacterSheetPage.tsx
 */
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import CallbackPage from './pages/CallbackPage'
import CharacterSheetPage from './pages/CharacterSheetPage'

export default function App() {
  // Route map for the three user-facing views.
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/character" element={<CharacterSheetPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
