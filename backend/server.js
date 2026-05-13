require('dotenv').config()

const express = require('express')
const cookieParser = require('cookie-parser')

const authRouter = require('./api/auth')
const spotifyRouter = require('./api/spotify')
const characterRouter = require('./api/character')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())

app.get('/health', (req, res) => res.json({ ok: true }))

app.use('/api/auth', authRouter)
app.use('/api/spotify', spotifyRouter)
app.use('/api/character', characterRouter)

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`))
