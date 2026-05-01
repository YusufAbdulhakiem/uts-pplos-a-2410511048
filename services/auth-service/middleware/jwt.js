const jwt = require('jsonwebtoken')
const db = require('../config/db')

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer '))
      return res.sendStatus(401)

    const token = authHeader.split(' ')[1]

    // cek blacklist
    const [b] = await db.query(
      "SELECT * FROM token_blacklist WHERE token=?",
      [token]
    )

    if (b.length) return res.sendStatus(401)

    // verify JWT
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)

    req.user = decoded

    next()
  } catch (err) {
    return res.sendStatus(403)
  }
}