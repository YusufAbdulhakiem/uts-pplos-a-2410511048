require('dotenv').config()
const express = require('express')
const rateLimit = require('express-rate-limit')
const jwt = require('jsonwebtoken')
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express()

// RATE LIMIT
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60
})

// JWT CHECK
function verifyJWT(req, res, next) {
  if (req.path.startsWith('/auth')) return next()

  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.sendStatus(401)

  try {
    jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.sendStatus(403)
  }
}

app.use(limiter)
app.use(verifyJWT)

// ROUTING KE AUTH SERVICE
app.use('/auth', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true
}))

// ROUTING KE PROPERTY SERVICE
app.use('/properties', createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true
}))

app.listen(3000, () => {
  console.log('Gateway berjalan di port 3000')
})