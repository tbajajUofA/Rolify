/**
 * Demo mode profiles.
 *
 * Purpose:
 * - Gives the landing page a few prebuilt personalities so the app can be explored without Spotify login.
 *
 * Cross references:
 * - Triggered from src/pages/LoginPage.tsx
 * - Rendered in src/pages/CharacterSheetPage.tsx when demo_mode is enabled
 */
export const DEMO_PROFILES = {
  carti: { id: 'carti', name: 'Vamp Slayer', description: 'High energy trap/rage rap demo' },
  sabrina: { id: 'sabrina', name: 'Pop Princess', description: 'Upbeat pop demo' },
  tyler: { id: 'tyler', name: 'Creative Rebel', description: 'Alternative hip-hop demo' },
  weeknd: { id: 'weeknd', name: 'Night Owl', description: 'Dark R&B demo' }
}
