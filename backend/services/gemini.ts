/**
 * Gemini response helpers.
 *
 * Purpose:
 * - Parse the model response into JSON.
 * - Keep the Gemini API details out of the character orchestration layer.
 *
 * Cross reference:
 * - Called only from backend/services/character.ts.
 */

import { AppError } from './spotify'

export function extractJson(text: string | undefined | null): Record<string, unknown> {
  // Gemini can return plain JSON or JSON wrapped in markdown fences.
  if (!text) {
    throw new Error('Empty Gemini response')
  }

  // Strip code fences if the model wrapped its answer in markdown.
  const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = (fencedMatch ? fencedMatch[1] : text).trim()
  // Pull the first JSON object out of the response text.
  const jsonMatch = candidate.match(/\{[\s\S]*\}/)
  const jsonText = (jsonMatch ? jsonMatch[0] : candidate).trim()

  return JSON.parse(jsonText) as Record<string, unknown>
}

export async function generateGeminiJson(prompt: string): Promise<Record<string, unknown>> {
  // Gemini API key must stay server-side.
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('Gemini API key not configured')
  }

  // Allow the model name and full endpoint to be overridden from env for deployment flexibility.
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash'
  const endpoint =
    process.env.GEMINI_API_URL ||
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  // Send a single-turn prompt and request JSON-formatted output.
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        responseMimeType: 'application/json'
      }
    })
  })

  const data = (await response.json()) as Record<string, any>

  if (!response.ok) {
    const message = data?.error?.message || `Gemini request failed with status ${response.status}`
    const error: AppError = new Error(message)
    error.status = response.status
    error.payload = data
    throw error
  }

  // Gemini nests its generated text inside candidates -> content -> parts.
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined
  return extractJson(text)
}
