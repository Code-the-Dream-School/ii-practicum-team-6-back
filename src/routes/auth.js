const express = require('express');
const authController = require('../controllers/authController')
const router = express.Router();
const { validateRequest } = require('../middleware/validateRequest')
const registerSchema = require('../validators/registerValidator')
const { authenticate } = require('../middleware/authMiddleware');
const loginSchema = require('../validators/loginValidator');
const resetPasswordSchema = require('../validators/resetPasswordValidator');

router.post('/register', validateRequest(registerSchema), authController.signUp)
router.post('/login', validateRequest(loginSchema), authController.signIn)
router.post('/logout', authController.signOut)
router.get('/me', authenticate, authController.authMe)
router.post('/forgot-password', authenticate, authController.forgotPassword)
router.post('/reset-password/:token', authenticate, validateRequest(resetPasswordSchema), authController.resetPassword)



module.exports = router;