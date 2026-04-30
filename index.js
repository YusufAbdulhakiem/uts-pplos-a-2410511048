require('dotenv').config()
const express = require('express')
const rateLimit = require('express-rate-limit')
const jwt = require('jsonwebtoken')
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express()

// rate limit
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS),
  max: parseInt(process.env.RATE_LIMIT_MAX)
})

// jwt check
function verifyJWT(req, res, next) {
  if (req.path.startsWith('/auth')) return next()

  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.sendStatus(401)

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
<<<<<<< HEAD:index.js
    req.headers['x-user-id'] = decoded.id
=======

    // kirim user ke semua service
    req.headers['x-user-id'] = decoded.id

>>>>>>> c255b841207de8379f6fadac305c820167d2a3c3:gateway/index.js
    next()
  } catch {
    res.sendStatus(403)
  }
}

app.use(limiter)
app.use(verifyJWT)

<<<<<<< HEAD:index.js
// auth
app.use('/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/auth': ''
  }
}))

// property
app.use('/properties', createProxyMiddleware({
  target: process.env.PROPERTY_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/properties': ''
  }
}))

// booking
app.use('/bookings', createProxyMiddleware({
  target: process.env.BOOKING_SERVICE_URL,
  changeOrigin: true
}))

app.listen(process.env.PORT, () => {
  console.log('gateway jalan di port', process.env.PORT)
=======
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
>>>>>>> c255b841207de8379f6fadac305c820167d2a3c3:gateway/index.js
})