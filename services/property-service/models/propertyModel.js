const db = require('../config/db')

exports.create = async ({ title, location, price }) => {
  await db.query(
    "INSERT INTO properties(title,location,price) VALUES(?,?,?)",
    [title, location, price]
  )
}

exports.findAll = async ({ page, per_page, location, min_price, max_price }) => {
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
  return rows
}

exports.findById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM properties WHERE id=?",
    [id]
  )
  return rows[0]
}

exports.update = async (id, data) => {
  const { title, location, price } = data

  await db.query(
    "UPDATE properties SET title=?, location=?, price=? WHERE id=?",
    [title, location, price, id]
  )
}

exports.remove = async (id) => {
  await db.query(
    "DELETE FROM properties WHERE id=?",
    [id]
  )
}