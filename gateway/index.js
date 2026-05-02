require('dotenv').config()
const express = require('express')
const rateLimit = require('express-rate-limit')
const jwt = require('jsonwebtoken')
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express()

// rate limit
app.use(rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS),
  max: parseInt(process.env.RATE_LIMIT_MAX)
}))

// jwt middleware
function verifyJWT(req, res, next) {
  if (req.originalUrl.startsWith('/auth')) return next()

  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.sendStatus(401)

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    req.headers['x-user-id'] = decoded.id
    next()
  } catch {
    return res.sendStatus(403)
  }
}

app.use(verifyJWT)


// auth service
app.use('/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/auth': ''
  }
}))


// property service
app.use('/properties', createProxyMiddleware({
  target: process.env.PROPERTY_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/properties': ''
  }
}))


// booking service (laravel)
app.use('/bookings', createProxyMiddleware({
  target: process.env.BOOKING_SERVICE_URL,
  changeOrigin: true,

  pathRewrite: (path, req) => {
    const newPath = req.originalUrl.replace(/^\/bookings/, '/api/bookings')
    return newPath
  },

  onProxyReq: (proxyReq, req) => {
  }
}))

app.listen(process.env.PORT, () => {
  console.log('Gateway running on port', process.env.PORT)
})