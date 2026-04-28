const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const pool = require('../db');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await pool.query('SELECT * FROM users WHERE email=?', [email]);
  if (!rows.length) return res.status(401).json({ message: 'Invalid' });

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid' });

  const access = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refresh = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  await pool.query('UPDATE users SET refresh_token=? WHERE id=?', [refresh, user.id]);

  res.json({ access_token: access, refresh_token: refresh });
});

router.post('/refresh', async (req, res) => {
  const { refresh_token } = req.body;

  try {
    const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);

    const [rows] = await pool.query('SELECT * FROM users WHERE id=? AND refresh_token=?',
      [decoded.id, refresh_token]);

    if (!rows.length) return res.status(403).json({ message: 'Invalid' });

    const access = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    res.json({ access_token: access });
  } catch {
    res.status(403).json({ message: 'Invalid' });
  }
});

router.post('/logout', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  await pool.query(
    'INSERT INTO token_blacklist (token, expired_at) VALUES (?, DATE_ADD(NOW(), INTERVAL 15 MINUTE))',
    [token]
  );

  res.json({ message: 'Logged out' });
});

router.get('/oauth/google', (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT}&response_type=code&scope=profile email`;
  res.redirect(url);
});

router.get('/oauth/google/callback', async (req, res) => {
  const { code } = req.query;

  const { data } = await axios.post('https://oauth2.googleapis.com/token', {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    code,
    redirect_uri: process.env.GOOGLE_REDIRECT,
    grant_type: 'authorization_code'
  });

  const userInfo = await axios.get(
    'https://www.googleapis.com/oauth2/v2/userinfo',
    { headers: { Authorization: `Bearer ${data.access_token}` } }
  );

  const { email, name, picture } = userInfo.data;

  let [rows] = await pool.query('SELECT * FROM users WHERE email=?', [email]);

  if (!rows.length) {
    await pool.query(
      'INSERT INTO users (name, email, oauth_provider, photo) VALUES (?, ?, ?, ?)',
      [name, email, 'google', picture]
    );
    [rows] = await pool.query('SELECT * FROM users WHERE email=?', [email]);
  }

  const user = rows[0];

  const access = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refresh = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.json({ access_token: access, refresh_token: refresh });
});

module.exports = router;