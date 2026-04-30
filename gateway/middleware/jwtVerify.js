const axios = require('axios')

module.exports = async function (req, res, next) {
  if (req.path.startsWith('/auth')) return next()

  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.sendStatus(401)

  try {
    await axios.post(process.env.AUTH_SERVICE_URL + '/auth/verify', { token })
    next()
  } catch {
    res.sendStatus(403)
  }
}