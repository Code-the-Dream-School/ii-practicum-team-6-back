const express = require('express')
const router = express.Router()

const{getAllSkills}= require('../controllers/skills')

router.route('/').get(getAllSkills)

module.exports= router