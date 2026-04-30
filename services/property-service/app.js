require('dotenv').config() 

const express = require('express')
const routes = require('./routes/propertyRoutes')
const authGuard = require('./middlewares/authGuard')

const app = express()

// DEBUG START
console.log('Property service starting...')

// middleware
app.use(express.json())

// auth dari gateway
app.use(authGuard)

// routes
app.use('/auth', routes)

// health check (biar bisa test di browser)
app.get('/', (req, res) => {
  res.send('Property service OK')
})

// error handler global
app.use((err, req, res, next) => {
  console.error('ERROR:', err)
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  })
})

const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
  console.log(`Property service running on port ${PORT}`)
})