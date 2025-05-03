const express = require('express');
const fetchProjectMiddleware = require('../middleware/fetchProjectMiddleware');
const validate = require('../middleware/projectValidateMiddleware');
const { projectCreateValidator } = require('../validators/projectCreateValidator');
const {projectUpdateValidator} = require('../validators/projectUpdateValidator')
const commentRoutes = require('./comments')
const { authenticate } = require('../middleware/authMiddleware');
const {
  getAllProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  leaveProject,
  sendJoinRequest,
  toggleVote,
  getAllVotes,
  getProjectJoinRequests,
  unsendJoinRequest
} = require('../controllers/projects');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management APIs
 */

/**
 * @swagger
* /projects:
*   get:
*     summary: Get all projects
*     tags: [Projects]
*     description: |
*       Example request:
*       GET /projects?limit=5&page=1&sort=mostLiked&search=collaboration
*     parameters:
*       - in: query
*         name: limit
*         schema:
*           type: integer
*         required: false
*         description: Number of projects per page (default is 10)
*         example: 5
*       - in: query
*         name: page
*         schema:
*           type: integer
*         required: false
*         description: Page number to retrieve (default is 1)
*         example: 1
*       - in: query
*         name: sort
*         schema:
*           type: string
*           enum: [createdAt-desc, mostLiked]
*         required: false
*         description: Sort by newest (createdAt-desc) or most liked (mostLiked)
*         example: mostLiked
*       - in: query
*         name: search
*         schema:
*           type: string
*         required: false
*         description: Keyword to search in title or description
*         example: collaboration
*     responses:
*       200:
*         description: List of all projects
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
*                   example: Projects fetched successfully
*                 data:
*                   type: object
*                   properties:
*                     projects:
*                       type: array
*                       items:
*                         $ref: '#/components/schemas/Project'
*                     numberOfProjects:
*                       type: integer
*                       example: 20
*                     currentPage:
*                       type: integer
*                       example: 1
*                     totalPages:
*                       type: integer
*                       example: 2
 *
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error getting the projects
 *
 * 
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectBody'  
 *
 *     responses:
 *       201:
 *         description: Project created successfully
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
 *                   example: Project created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     project:
 *                       $ref: '#/components/schemas/Project'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error creating the project
 */
router.route('/')
  .get(getAllProjects)
  .post(authenticate,validate(projectCreateValidator), createProject);

 /**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project fetched successfully
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
 *                   example: Project fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     project:
 *                       allOf:
 *                         - $ref: '#/components/schemas/Project'
 *                         - type: object
 *                           properties:
 *                             likesCount:
 *                               type: integer
 *                               description: Number of likes on the project
 *                               example: 1
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error getting the project
 *   patch:
 *     summary: Update a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectBody' 
 *     responses:
 *       200:
 *         description: Project updated successfully
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
 *                   example: Project updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     project:
 *                       $ref: '#/components/schemas/Project'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: You are not authorized to update this project
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error updating the project
 *   delete:
 *     summary: Delete a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
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
 *                   example: Project deleted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     project:
 *                       $ref: '#/components/schemas/Project'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: You are not authorized to delete this project
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error deleting the project
 */
router.route('/:id')
  .all(fetchProjectMiddleware)
  .get(authenticate,getProjectById)
  .delete(authenticate,deleteProject)
  .patch(authenticate,validate(projectUpdateValidator), updateProject);

//**
/**
 * @swagger
 * /projects/{id}/leave:
 *   post:
 *     summary: Leave a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Project ID
 *     responses:
 *       200:
 *         description: User has successfully left the project
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
 *                   example: User has successfully left the project
 *       400:
 *         description: User is not a team member of this project
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User is not a team member of this project
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error leaving the project
 */
router.route('/:id/leave')
  .post(authenticate,fetchProjectMiddleware, leaveProject);
  /**
 * @swagger
 * tags:
 *   name: Votes
 *   description: 'Endpoints for voting on projects (like, unlike, get vote count).'
 */
/**
 * @swagger
 * /projects/{id}/votes:
 *   get:
 *     summary: Get all votes (likes) for a project
 *     tags: [Votes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project likes fetched successfully
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
 *                   example: Project likes fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     likesCount:
 *                       type: integer
 *                       example: 5
 *
 *   post:
*     summary: Toggle a vote (like/unlike) for a project
*     tags: [Votes]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: Project ID
*     responses:
*       200:
*         description: Project liked or unliked
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
*                   example: Project liked
*                 data:
*                   type: object
*                   properties:
*                     likesCount:
*                       type: integer
*                       example: 6
 */
router.route('/:id/votes')
  .all(fetchProjectMiddleware)
  .post(authenticate,toggleVote)
  .get(getAllVotes)

/**
/**
 * @swagger
 * /projects/{id}/join-requests:
 *   post:
 *     summary: Send a join request to a project
 *     tags: [JoinRequests]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The project ID to join
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "660aa20dc32c7f5320e9a4e1"
 *               joinMessage:
 *                 type: string
 *                 example: "I'd love to join this project as a front-end developer."
 *     responses:
 *       201:
 *         description: Join request created successfully
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
 *                   example: Join request sent
 *                 data:
 *                   type: object
 *                   properties:
 *                     request:
 *                       $ref: '#/components/schemas/ProjectRequest'
 *       200:
 *         description: Join request already exists and was updated
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
 *                   example: Join request updated
 *                 data:
 *                   type: object
 *                   properties:
 *                     request:
 *                       $ref: '#/components/schemas/ProjectRequest'
 *       400:
 *         description: Bad request — missing fields or invalid operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User ID and join message are required
 *       500:
 *         description: Server error while sending join request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error sending join request
 *
 *   get:
 *     summary: Get all join requests for a project
 *     tags: [JoinRequests]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The project ID to get join requests for
 *     responses:
 *       200:
 *         description: List of join requests retrieved successfully
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
 *                   example: Join requests fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     requests:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ProjectRequest'
 *       404:
 *         description: No join requests found for this project
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: There is no request for this project
 *       500:
 *         description: Server error while retrieving join requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error retrieving join requests
 *
 *   delete:
 *     summary: Unsend a join request for a project
 *     tags: [JoinRequests]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "660aa20dc32c7f5320e9a4e1"
 *     responses:
 *       200:
 *         description: Join request unsent successfully
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
 *                   example: Join request unsent successfully
 *                 data:
 *                   type: object
 *                   example: {}
 *       404:
 *         description: No join request found for this project and user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: No request found for project with id 660b01e0cd3f4a3fb40aa67e
 *       500:
 *         description: Server error while unsending join request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error unsending join request
 */

router.route('/:id/join-requests')
  .all(fetchProjectMiddleware)
  .post(authenticate,sendJoinRequest)
  .get(getProjectJoinRequests)
  .delete(authenticate,unsendJoinRequest);

router.use('/:projectId/comments', commentRoutes);
module.exports = router;