const service = require('../services/propertyService')

exports.create = (req, res) => service.create(req, res)
exports.list = (req, res) => service.list(req, res)
exports.detail = (req, res) => service.detail(req, res)
exports.update = (req, res) => service.update(req, res)
exports.remove = (req, res) => service.remove(req, res)