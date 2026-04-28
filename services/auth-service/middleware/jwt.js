const jwt = require('jsonwebtoken')
const db = require('../db')

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.sendStatus(401)

  const [b] = await db.query(
    "SELECT * FROM token_blacklist WHERE token=?",
    [token]
  )
  if (b.length) return res.sendStatus(401)

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.sendStatus(403)
  }
}