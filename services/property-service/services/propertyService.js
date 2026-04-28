const model = require('../models/propertyModel')

exports.create = async (req, res) => {
  const { title, location, price } = req.body

  if (!title || !location || typeof price !== 'number') {
    return res.status(422).json({ msg: 'Invalid input' })
  }

  await model.create({ title, location, price })

  res.status(201).json({ msg: 'Property created' })
}

exports.list = async (req, res) => {
  let { page = 1, per_page = 5, location, min_price, max_price } = req.query

  page = parseInt(page)
  per_page = parseInt(per_page)

  const data = await model.findAll({
    page,
    per_page,
    location,
    min_price,
    max_price
  })

  res.json(data)
}

exports.detail = async (req, res) => {
  const data = await model.findById(req.params.id)

  if (!data) return res.status(404).json({ msg: 'Not found' })

  res.json(data)
}

exports.update = async (req, res) => {
  await model.update(req.params.id, req.body)
  res.json({ msg: 'Updated' })
}

exports.remove = async (req, res) => {
  await model.remove(req.params.id)
  res.status(204).send()
}