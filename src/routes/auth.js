const express = require('express');
const authController = require('../controllers/authController')
const router = express.Router();
const { validateRequest } = require('../middleware/validateRequest')
const registerSchema = require('../validators/registerValidator')
const { authenticate } = require('../middleware/authMiddleware')

router.post('/register', validateRequest(registerSchema), authController.signUp)
router.post('/login', authController.signIn)
router.post('/logout', authController.signOut)
router.get('/users',authenticate, authController.getAllUsers)
router.get('/users/:id',authenticate, authController.getUserById)
router.get('/me', authenticate, authController.authMe)
router.delete('/me', authenticate, authController.deleteMyUser)
router.patch('/me', authenticate, authController.updateMyProfile)
router.post('/forgot-password', authenticate, authController.forgotPassword)
router.post('/reset-password/:token', authenticate, authController.resetPassword)


module.exports = router;