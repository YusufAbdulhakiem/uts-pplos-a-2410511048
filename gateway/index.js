require('dotenv').config()
const express = require('express')
const rateLimit = require('express-rate-limit')
const jwt = require('jsonwebtoken')
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express()

// RATE LIMIT
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS),
  max: parseInt(process.env.RATE_LIMIT_MAX)
})

// JWT CHECK
function verifyJWT(req, res, next) {
  if (req.path.startsWith('/auth')) return next()

  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.sendStatus(401)

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)

    // 🔥 kirim user ke semua service
    req.headers['x-user-id'] = decoded.id

    next()
  } catch {
    res.sendStatus(403)
  }
}

app.use(limiter)
app.use(verifyJWT)

// AUTH
app.use('/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL,
  changeOrigin: true
}))

// PROPERTY
app.use('/properties', createProxyMiddleware({
  target: process.env.PROPERTY_SERVICE_URL,
  changeOrigin: true
}))

// BOOKING
app.use('/bookings', createProxyMiddleware({
  target: process.env.BOOKING_SERVICE_URL,
  changeOrigin: true
}))

app.listen(process.env.PORT, () => {
  console.log('Gateway jalan di port', process.env.PORT)
})