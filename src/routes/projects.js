const express = require('express');
const fetchProjectMiddleware = require('../middleware/fetchProject');
const validate = require('../middleware/projectValidate');
const { projectValidationSchema } = require('../validators/project');
const {
  getAllProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  leaveProject,
  sendJoinRequest,
  addVote,
  getAllVotes,
  removeVote,
  getProjectJoinRequests,
  unsendJoinRequest,
} = require('../controllers/projects');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management endpoints
 */

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of projects
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *     responses:
 *       201:
 *         description: Project created successfully
 */
router
  .route('/')
  .get(getAllProjects)
  .post(validate(projectValidationSchema), createProject);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project details
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *   patch:
 *     summary: Update a project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 */
router
  .route('/:id')
  .all(fetchProjectMiddleware)
  .get(getProjectById)
  .delete(deleteProject)
  .patch(validate(projectValidationSchema), updateProject);

/**
 * @swagger
 * /projects/{id}/leave:
 *   post:
 *     summary: Leave a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully left project
 */
router.route('/:id/leave').post(fetchProjectMiddleware, leaveProject);

/**
 * @swagger
 * /projects/{id}/join-requests:
 *   post:
 *     summary: Send a join request to a project
 *     tags: [Projects]
 *   get:
 *     summary: Get all join requests for a project
 *     tags: [Projects]
 *   delete:
 *     summary: Unsend a join request
 *     tags: [Projects]
 */
router
  .route('/:id/join-requests')
  .all(fetchProjectMiddleware)
  .post(sendJoinRequest)
  .get(getProjectJoinRequests)
  .delete(unsendJoinRequest);

/**
 * @swagger
 * /projects/{id}/votes:
 *   post:
 *     summary: Add a vote to a project
 *     tags: [Projects]
 *   get:
 *     summary: Get all votes for a project
 *     tags: [Projects]
 *   delete:
 *     summary: Remove your vote from a project
 *     tags: [Projects]
 */
router
  .route('/:id/votes')
  .all(fetchProjectMiddleware)
  .post(addVote)
  .get(getAllVotes)
  .delete(removeVote);

module.exports = router;