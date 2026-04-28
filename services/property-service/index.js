require('dotenv').config()
const express = require('express')
const routes = require('./routes/property')

const app = express()

// middleware global
app.use(express.json())

// routing utama
app.use('/properties', routes)

// fallback 404 (biar clean)
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' })
})

// error handler (optional tapi bagus untuk nilai)
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
})

app.listen(process.env.PORT, () => {
  console.log(`Property service running on port ${process.env.PORT}`)
})