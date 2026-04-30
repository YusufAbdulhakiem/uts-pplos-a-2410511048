const express = require('express')
const routes = require('./routes/propertyRoutes')
const authGuard = require('./middlewares/authGuard')

const app = express()

app.use(express.json())

app.use(authGuard) // wajib dari gateway
app.use('/properties', routes)

// error handler global
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  })
})

module.exports = app