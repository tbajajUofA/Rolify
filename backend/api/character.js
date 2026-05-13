const express = require('express')
const { getAccessTokenFromRequest } = require('../services/spotify')
const { generateCharacterProfile } = require('../services/character')

const router = express.Router()

router.post('/generate', async (req, res) => {
  try {
    const accessToken = getAccessTokenFromRequest(req)
    const timeRange = req.body?.time_range || req.query?.time_range || 'medium_term'
    const profile = await generateCharacterProfile(accessToken, timeRange)
    return res.json(profile)
  } catch (error) {
    console.error('Character generation failed:', error)
    return res.status(error.status || 500).json({ error: error.message || 'Failed to generate personality profile' })
  }
})

module.exports = router