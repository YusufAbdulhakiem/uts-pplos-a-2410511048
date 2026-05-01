require('dotenv').config() 

const express = require('express')
const routes = require('./routes/propertyRoute')
const authGuard = require('./middlewares/authGuard')

const app = express()

// middleware
app.use(express.json())

// auth dari gateway
app.use(authGuard)

// routes
app.use('/', routes)

const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
  console.log(`Property service running on port ${PORT}`)
})