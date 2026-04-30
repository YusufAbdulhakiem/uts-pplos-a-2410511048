const service = require('../services/propertyService')

exports.create = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id']
    const data = await service.create(userId, req.body)
    res.status(201).json(data)
  } catch (err) {
    next(err)
  }
}

exports.list = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id']
    const data = await service.list(userId, req.query)
    res.json(data)
  } catch (err) {
    next(err)
  }
}

exports.detail = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id']
    const data = await service.detail(userId, req.params.id)
    res.json(data)
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id']
    const data = await service.update(userId, req.params.id, req.body)
    res.json(data)
  } catch (err) {
    next(err)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id']
    await service.remove(userId, req.params.id)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}