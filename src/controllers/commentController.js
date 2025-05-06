const { getAllCommentsByTheProjectId, sendCommentByProjectId } = require('../services/commentServices')
const {toCommentResponseDto,toCommentsResponseDto} = require('../dtos/comment.dto')


exports.getAllCommentsByTheProjectId = async (req, res, next) => {

    try {
        const projectId = req.params.projectId
        const comments = await getAllCommentsByTheProjectId(projectId)

        res.status(200).json({
            success: true,
            message: 'Comments Fetched Successfully',
            data: {
                comments: toCommentsResponseDto(comments),
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
        const userId = req.user.id
        const comment = await sendCommentByProjectId(projectId , text, parentCommentId, userId)
      
        res.status(200).json({
            success: true,
            message: 'Comment Sent Successfully',
            data: {
                comment: toCommentResponseDto(comment)
            }
        })
    }
    catch (err) {
        next(err)
    }
}




