const express = require('express')
const fetchProjectMiddleware = require('../middleware/fetchProject')
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
    addProjectComment,
    getProjectCommments}= require('../controllers/projects')

const router = express.Router()

router.route('/').get(getAllProjects).post(createProject)
router.route('/:id').all(fetchProjectMiddleware).get(getProjectById).delete(deleteProject).patch(updateProject)
router.route('/:id/leave').post(fetchProjectMiddleware,leaveProject)
// ========= join requests for a project ===============
router.route('/:id/join-requests').all(fetchProjectMiddleware).post(sendJoinRequest).get(getProjectJoinRequests)
// =============== votes for a project =================
router.route('/:id/votes').all(fetchProjectMiddleware).post(addVote).get(getAllVotes).delete(removeVote)


module.exports= router