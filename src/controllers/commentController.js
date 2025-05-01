const BadRequestError = require('../errors/bad-request')
const authService = require('../services/authServices')
const { toUserResponseDto } = require('../dtos/user.dto')
const Comment = require('../models/comment')
const buildCommentTree = require('../utils/buildCommentTree')
const { getAllCommentsByTheProjectId, sendCommentByProjectId } = require('../services/commentServices')



exports.getAllCommentsByTheProjectId = async (req, res, next) => {

    try {
        const projectId = req.params.projectId
        const comments = await getAllCommentsByTheProjectId(projectId)

        res.status(200).json({
            success: true,
            message: 'Comments Fetched Successfully',
            data: {
                comments: comments,
                total: comments.length
            }
        })
    }
    catch (err) {
        next(err)
    }
}

exports.sendCommentByProjectId = async (req, res, next) => {

    try {
        const projectId = req.params.projectId
        const { text, parentCommentId } = req.body;
        console.log(parentCommentId)
        const userId = req.user.id
        const comment = await sendCommentByProjectId(projectId , text, parentCommentId, userId)
      
        res.status(200).json({
            success: true,
            message: 'Comment Sent Successfully',
            data: {
                comment: comment
            }
        })
    }
    catch (err) {
        next(err)
    }
}




