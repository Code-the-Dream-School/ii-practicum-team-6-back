const express = require('express')
const router = express.Router({ mergeParams: true })
const commentController = require('../controllers/commentController')
const { authenticate } = require('../middleware/authMiddleware');
const commentSchema = require('../validators/commentValidator');
const { validateRequest } = require('../middleware/validateRequest')



router.get('/', authenticate,  commentController.getAllCommentsByTheProjectId)
router.post('/', authenticate, validateRequest(commentSchema), commentController.sendCommentByProjectId)

module.exports = router