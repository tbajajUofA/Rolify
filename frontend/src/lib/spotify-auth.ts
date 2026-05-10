const AUTH_URL = 'https://accounts.spotify.com/authorize'

function base64UrlEncode(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  let str = ''
  for (let i = 0; i < bytes.byteLength; i++) str += String.fromCharCode(bytes[i])
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function sha256(verifier: string) {
  const enc = new TextEncoder()
  const data = enc.encode(verifier)
  return await crypto.subtle.digest('SHA-256', data)
}

function randomString(length = 128) {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array).map(n => ('0' + (n % 36).toString(36)).slice(-1)).join('').slice(0, length)
}

export function isSpotifyConfigured() {
  return !!import.meta.env.VITE_SPOTIFY_CLIENT_ID
}

export async function redirectToSpotifyAuth() {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
  const redirect = import.meta.env.VITE_SPOTIFY_REDIRECT_URI
  if (!clientId || !redirect) throw new Error('Spotify client ID or redirect URI not configured')

  const codeVerifier = randomString(128)
  const hash = await sha256(codeVerifier)
  const codeChallenge = base64UrlEncode(hash)
  localStorage.setItem('spotify_code_verifier', codeVerifier)

  const scope = encodeURIComponent('user-read-private user-read-email user-top-read')
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirect,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    scope
  })
  window.location.href = `${AUTH_URL}?${params.toString()}`
}

export async function handleSpotifyCallback(code: string) {
  const verifier = localStorage.getItem('spotify_code_verifier')
  if (!verifier) throw new Error('Missing PKCE code verifier in localStorage')

  // Send code + verifier to backend which will exchange and set httpOnly cookies
  const res = await fetch('/api/auth/exchange', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, code_verifier: verifier })
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Server token exchange failed: ${res.status} ${text}`)
  }

  return res.json()
}

export function getAccessToken() {
  // Tokens are stored in httpOnly cookies; client shouldn't read them.
  return null
}

export function clearSpotifyAuth() {
  // Clear server cookies and local PKCE state, then redirect to landing
  fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
  localStorage.removeItem('spotify_code_verifier')
  localStorage.removeItem('demo_mode')
  localStorage.removeItem('demo_profile_id')
  try { window.location.href = '/' } catch (e) {}
}

export async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
  localStorage.removeItem('spotify_code_verifier')
  localStorage.removeItem('demo_mode')
  localStorage.removeItem('demo_profile_id')
  window.location.href = '/'
}
