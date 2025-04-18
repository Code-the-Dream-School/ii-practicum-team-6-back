const express = require('express');
const userController = require('../controllers/userController')
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware')
const userIdSchema = require('../validators/userIdValidator');
const { validateRequest } = require('../middleware/validateRequest')


router.get('/',authenticate, userController.getAllUsers)
router.get('/:id',authenticate, validateRequest(userIdSchema, 'params') , userController.getUserById)
router.delete('/me', authenticate, userController.deleteMyProfile)
router.patch('/me', authenticate, userController.updateMyProfile)


module.exports = router;