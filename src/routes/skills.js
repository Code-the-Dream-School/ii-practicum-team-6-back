const express = require('express')
const router = express.Router()

const{getAllSkills, searchSkills}= require('../controllers/skillController')
/**
 * @swagger
 * /skills:
 *   get:
 *     tags:
 *       - Skills
 *     summary: Get all skills
 *     description: Returns a list of all available skills.
 *     responses:
 *       200:
 *         description: A list of skills
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Skills fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     skills:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Skills'
 */

/**
 * @swagger
 * /skills/search:
 *   get:
 *     tags:
 *       - Skills
 *     summary: Search skills
 *     description: Searches skills by keyword in request body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               searchBody:
 *                 type: string
 *                 example: React
 *     responses:
 *       200:
 *         description: Matching skills
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Skills fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     skills:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: React
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Skill:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 67f72a7b0be20fd8f69e3e8b
 *         name:
 *           type: string
 *           example: React
 */
router.route('/').get(getAllSkills)
router.route('/search').get(searchSkills)

module.exports= router