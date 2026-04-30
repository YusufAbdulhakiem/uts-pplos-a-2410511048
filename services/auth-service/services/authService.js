const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const axios = require('axios')
const db = require('../config/db')

const at = (u) =>
  jwt.sign(u, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' })

const rt = (u) =>
  jwt.sign(u, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })

exports.register = async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password)
    return res.status(422).json({ msg: 'Invalid input' })

  const hash = await bcrypt.hash(password, 10)

  await db.query(
    "INSERT INTO users(name,email,password) VALUES(?,?,?)",
    [name, email, hash]
  )

  res.sendStatus(201)
}

exports.login = async (req, res) => {
  const { email, password } = req.body

  const [u] = await db.query("SELECT * FROM users WHERE email=?", [email])
  if (!u.length) return res.sendStatus(404)

  const ok = await bcrypt.compare(password, u[0].password)
  if (!ok) return res.sendStatus(401)

  const payload = { id: u[0].id, email: u[0].email }

  const accessToken = at(payload)
  const refreshToken = rt(payload)

  await db.query(
    "INSERT INTO refresh_tokens(user_id,token,expires_at) VALUES(?,?,DATE_ADD(NOW(), INTERVAL 7 DAY))",
    [u[0].id, refreshToken]
  )

  res.json({ accessToken, refreshToken })
}

exports.refresh = async (req, res) => {
  const { refreshToken } = req.body

  const [t] = await db.query(
    "SELECT * FROM refresh_tokens WHERE token=?",
    [refreshToken]
  )
  if (!t.length) return res.sendStatus(403)

  const u = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

  res.json({
    accessToken: at({ id: u.id, email: u.email })
  })
}

exports.logout = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]

  await db.query("INSERT INTO token_blacklist(token) VALUES(?)", [token])

  res.sendStatus(204)
}

exports.me = async (req, res) => {
  const [u] = await db.query(
    "SELECT id,name,email,photo FROM users WHERE id=?",
    [req.user.id]
  )

  res.json(u[0])
}

// 🔥 PENTING UNTUK GATEWAY
exports.verifyToken = async (req, res) => {
  const { token } = req.body

  const [b] = await db.query(
    "SELECT * FROM token_blacklist WHERE token=?",
    [token]
  )
  if (b.length) return res.sendStatus(401)

  try {
    jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    res.sendStatus(200)
  } catch {
    res.sendStatus(403)
  }
}

// OAUTH
exports.googleRedirect = (req, res) => {
  const url =
    `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${process.env.GOOGLE_REDIRECT}` +
    `&response_type=code&scope=profile email`

  res.redirect(url)
}

exports.googleCallback = async (req, res) => {
  const { code } = req.query

  const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT,
    grant_type: 'authorization_code'
  })

  const { access_token } = tokenRes.data

  const userInfo = await axios.get(
    'https://www.googleapis.com/oauth2/v2/userinfo',
    { headers: { Authorization: `Bearer ${access_token}` } }
  )

  const { name, email, picture, id } = userInfo.data

  let [u] = await db.query("SELECT * FROM users WHERE email=?", [email])
  let userId

  if (!u.length) {
    const [ins] = await db.query(
      "INSERT INTO users(name,email,photo,oauth_provider) VALUES(?,?,?,?)",
      [name, email, picture, 'google']
    )
    userId = ins.insertId
  } else userId = u[0].id

  res.json({
    name,
    email,
    photo: picture
  })
}