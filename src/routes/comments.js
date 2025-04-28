const express = require('express')
const router = express.Router()

const{}= require('../controllers/commentController')

router.route('/').get()

module.exports= router