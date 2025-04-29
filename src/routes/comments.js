const express = require('express')
const router = express.Router()
const commentController = require('../controllers/commentController')
const { authenticate } = require('../middleware/authMiddleware');



router.get('/',  authenticate, commentController.getAllCommentsByTheProjectId)
router.post('/',  authenticate, commentController.sendCommentByProjectId)

module.exports= router