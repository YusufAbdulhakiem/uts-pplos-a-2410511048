require('dotenv').config()
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const rateLimit = require('express-rate-limit')
const jwt = require('jsonwebtoken')

const app = express()

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60
})

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

app.use('/auth', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }))
app.listen(3000)