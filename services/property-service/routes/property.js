const express = require('express')
const db = require('../db')
const router = express.Router()

// CREATE
router.post('/', async (req, res) => {
  const { title, location, price } = req.body
  const userId = req.headers['x-user-id']

  if (!title || !location || !price)
    return res.status(422).json({ msg: 'Input tidak valid' })

  await db.query(
    "INSERT INTO properties(user_id,title,location,price) VALUES(?,?,?,?)",
    [userId, title, location, price]
  )

  res.status(201).json({ msg: 'Property dibuat' })
})

// LIST + PAGING + FILTER
router.get('/', async (req, res) => {
  let { page = 1, per_page = 5, location, min_price, max_price } = req.query
  const userId = req.headers['x-user-id']

  page = parseInt(page)
  per_page = parseInt(per_page)
  const offset = (page - 1) * per_page

  let sql = "SELECT * FROM properties WHERE user_id=?"
  const params = [userId]

  if (location) {
    sql += " AND location LIKE ?"
    params.push(`%${location}%`)
  }

  if (min_price) {
    sql += " AND price >= ?"
    params.push(min_price)
  }

  if (max_price) {
    sql += " AND price <= ?"
    params.push(max_price)
  }

  sql += " LIMIT ? OFFSET ?"
  params.push(per_page, offset)

  const [rows] = await db.query(sql, params)
  res.json(rows)
})

// DETAIL
router.get('/:id', async (req, res) => {
  const userId = req.headers['x-user-id']

  const [rows] = await db.query(
    "SELECT * FROM properties WHERE id=? AND user_id=?",
    [req.params.id, userId]
  )

  if (rows.length === 0)
    return res.status(404).json({ msg: 'Tidak ditemukan' })

  res.json(rows[0])
})

// UPDATE
router.put('/:id', async (req, res) => {
  const { title, location, price } = req.body
  const userId = req.headers['x-user-id']

  await db.query(
    "UPDATE properties SET title=?, location=?, price=? WHERE id=? AND user_id=?",
    [title, location, price, req.params.id, userId]
  )

  res.json({ msg: 'Diupdate' })
})

// DELETE
router.delete('/:id', async (req, res) => {
  const userId = req.headers['x-user-id']

  await db.query(
    "DELETE FROM properties WHERE id=? AND user_id=?",
    [req.params.id, userId]
  )

  res.status(204).send()
})

module.exports = router