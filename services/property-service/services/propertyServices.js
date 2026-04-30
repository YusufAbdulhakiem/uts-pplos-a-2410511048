const model = require('../models/propertyModel')

exports.create = async (userId, data) => {
  const { title, location, price } = data

  if (!title || !location || typeof price !== 'number') {
    throw { status: 422, message: 'Invalid input' }
  }

  await model.create(userId, data)
  return { message: 'Property created' }
}

exports.list = async (userId, query) => {
  return model.findAll(userId, query)
}

exports.detail = async (userId, id) => {
  const data = await model.findById(userId, id)
  if (!data) throw { status: 404, message: 'Not found' }
  return data
}

exports.update = async (userId, id, data) => {
  await model.update(userId, id, data)
  return { message: 'Updated' }
}

exports.remove = async (userId, id) => {
  await model.remove(userId, id)
}
