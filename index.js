require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwtVerify = require('./middleware/jwtVerify');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rate limit: 60 request / menit / IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { message: 'Too many requests, please try again later.' },
});
app.use(limiter);

/**
 * =========================
 * AUTH SERVICE (NO JWT)
 * =========================
 */
app.use('/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE,
  changeOrigin: true,
}));

/**
 * =========================
 * PROPERTY SERVICE (JWT)
 * =========================
 */
app.use('/properties', jwtVerify, createProxyMiddleware({
  target: process.env.PROPERTY_SERVICE,
  changeOrigin: true,
}));

/**
 * =========================
 * BOOKING SERVICE (JWT)
 * =========================
 */
app.use('/bookings', jwtVerify, createProxyMiddleware({
  target: process.env.BOOKING_SERVICE,
  changeOrigin: true,
}));

/**
 * =========================
 * PAYMENT SERVICE (JWT)
 * =========================
 */
app.use('/payments', jwtVerify, createProxyMiddleware({
  target: process.env.PAYMENT_SERVICE,
  changeOrigin: true,
}));

app.listen(process.env.PORT, () => {
  console.log(`API Gateway running on port ${process.env.PORT}`);
});