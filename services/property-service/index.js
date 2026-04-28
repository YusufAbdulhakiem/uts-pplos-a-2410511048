require('dotenv').config()
const express = require('express')
const propertyRoutes = require('./routes/properties')

const app = express()
app.use(express.json())

app.use('/properties', propertyRoutes)

app.listen(process.env.PORT, () => {
  console.log('Property Service jalan di port', process.env.PORT)
})