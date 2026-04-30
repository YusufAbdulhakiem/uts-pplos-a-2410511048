require('dotenv').config()
const express = require('express')
const authRoutes = require('./routes/auth')

const app = express()
app.use(express.json())

app.use('/', authRoutes)

app.listen(process.env.PORT, () => {
  console.log('Auth service running on port', process.env.PORT)
})

^Berikut, index.js di auth-service di SERVICES

const mysql = require('mysql2/promise')

module.exports = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})