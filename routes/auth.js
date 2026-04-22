const { register, login } = require('../controller/authController')
const { registerSchema, loginSchema } = require('../schema/authSchema')
const validate = require('../middleware/validate')
const express = require('express')
const router = express.Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)

module.exports = router