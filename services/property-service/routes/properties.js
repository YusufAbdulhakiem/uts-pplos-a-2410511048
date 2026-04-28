const express = require('express')
const db = require('../db')
const router = express.Router()

// CREATE
router.post('/', async (req, res) => {
  const { title, location, price } = req.body
  if (!title || !location || !price)
    return res.status(422).json({ msg: 'Input tidak valid' })

  await db.query(
    "INSERT INTO properties(title,location,price) VALUES(?,?,?)",
    [title, location, price]
  )

  res.status(201).json({ msg: 'Property dibuat' })
})

// LIST + PAGING + FILTER
router.get('/', async (req, res) => {
  let { page = 1, per_page = 5, location, min_price, max_price } = req.query
  page = parseInt(page)
  per_page = parseInt(per_page)
  const offset = (page - 1) * per_page

  let sql = "SELECT * FROM properties WHERE 1=1"
  const params = []

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
  const [rows] = await db.query(
    "SELECT * FROM properties WHERE id=?",
    [req.params.id]
  )

  if (rows.length === 0)
    return res.status(404).json({ msg: 'Tidak ditemukan' })

  res.json(rows[0])
})

// UPDATE
router.put('/:id', async (req, res) => {
  const { title, location, price } = req.body

  await db.query(
    "UPDATE properties SET title=?, location=?, price=? WHERE id=?",
    [title, location, price, req.params.id]
  )

  res.json({ msg: 'Diupdate' })
})

// DELETE
router.delete('/:id', async (req, res) => {
  await db.query(
    "DELETE FROM properties WHERE id=?",
    [req.params.id]
  )

  res.status(204).send()
})

module.exports = router