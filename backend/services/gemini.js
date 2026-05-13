function extractJson(text) {
  if (!text) {
    throw new Error('Empty Gemini response')
  }

  const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = (fencedMatch ? fencedMatch[1] : text).trim()
  const jsonMatch = candidate.match(/\{[\s\S]*\}/)
  const jsonText = (jsonMatch ? jsonMatch[0] : candidate).trim()

  return JSON.parse(jsonText)
}

async function generateGeminiJson(prompt) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('Gemini API key not configured')
  }

  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash'
  const endpoint = process.env.GEMINI_API_URL || `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

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

  const data = await response.json()

  if (!response.ok) {
    const message = data?.error?.message || `Gemini request failed with status ${response.status}`
    const error = new Error(message)
    error.status = response.status
    error.payload = data
    throw error
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  return extractJson(text)
}

module.exports = {
  extractJson,
  generateGeminiJson
}