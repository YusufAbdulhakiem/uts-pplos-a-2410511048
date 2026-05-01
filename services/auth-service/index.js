require('dotenv').config()
const express = require('express')
const authRoutes = require('./routes/auth')

const app = express()

app.use(express.json())

// routes
app.use('/', authRoutes)

app.listen(process.env.PORT, () => {
  console.log('Auth service running on port', process.env.PORT)
})