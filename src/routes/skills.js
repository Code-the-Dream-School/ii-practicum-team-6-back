const express = require('express')
const router = express.Router()

const{getAllSkills, searchSkills}= require('../controllers/skillController')

router.route('/').get(getAllSkills)
router.route('/search').get(searchSkills)

module.exports= router