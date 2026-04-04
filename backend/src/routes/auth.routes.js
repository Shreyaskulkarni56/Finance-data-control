const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../schemas/auth.schema');
const authController = require('../controllers/auth.controller');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
module.exports = router;