const db = require('../config/db')

exports.create = async (userId, { title, location, price }) => {
  await db.query(
    "INSERT INTO properties(user_id,title,location,price) VALUES(?,?,?,?)",
    [userId, title, location, price]
  )
}

exports.findAll = async (userId, { page = 1, per_page = 5, location, min_price, max_price }) => {
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
  params.push(Number(per_page), Number(offset))

  const [rows] = await db.query(sql, params)
  return rows
}

exports.findById = async (userId, id) => {
  const [rows] = await db.query(
    "SELECT * FROM properties WHERE id=? AND user_id=?",
    [id, userId]
  )
  return rows[0]
}

exports.update = async (userId, id, { title, location, price }) => {
  await db.query(
    "UPDATE properties SET title=?, location=?, price=? WHERE id=? AND user_id=?",
    [title, location, price, id, userId]
  )
}

exports.remove = async (userId, id) => {
  await db.query(
    "DELETE FROM properties WHERE id=? AND user_id=?",
    [id, userId]
  )
}