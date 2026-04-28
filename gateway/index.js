require('dotenv').config()
const express = require('express')
const rateLimit = require('express-rate-limit')
const { createProxyMiddleware } = require('http-proxy-middleware')

const jwtVerify = require('./middleware/jwtVerify')

const app = express()

// RATE LIMIT
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 60
}))

app.use(express.json())

// JWT CHECK
app.use(jwtVerify)

// ROUTING
app.use('/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL,
  changeOrigin: true
}))

app.use('/properties', createProxyMiddleware({
  target: process.env.PROPERTY_SERVICE_URL,
  changeOrigin: true
}))

app.use('/bookings', createProxyMiddleware({
  target: process.env.BOOKING_SERVICE_URL,
  changeOrigin: true
}))

app.listen(3000, () => console.log('Gateway running'))