const express = require('express')
const controller = require('../controllers/authController')
const auth = require('../middleware/jwt')

const router = express.Router()

router.post('/register', controller.register)
router.post('/login', controller.login)
router.post('/refresh', controller.refresh)
router.post('/logout', auth, controller.logout)
router.get('/me', auth, controller.me)

// WAJIB untuk gateway
router.post('/verify', controller.verifyToken)

// OAuth
router.get('/oauth/google', controller.googleRedirect)
router.get('/oauth/google/callback', controller.googleCallback)

module.exports = router