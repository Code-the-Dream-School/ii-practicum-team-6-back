const BadRequestError = require('../errors/bad-request')
const authService = require('../services/authServices')
const { toUserResponseDto } = require('../dtos/user.dto')
const Comment = require('../models/comment')



exports.getAllCommentsByTheProjectId = async (req, res, next) => {
    try {
        const projectId = req.params.projectId
        console.log(projectId)
        const comments = await Comment.find();
        res.status(200).json({
            success: true,
            message: 'Comments Fetched Successfully',
            data: {
                comments: comments
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

        const comment = await Comment.create({
            text,
            userId : req.user.id,
            projectId,
            likes : [],
            parentomment: parentCommentId || null,
            createdBy: req.user.id,
          });
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




