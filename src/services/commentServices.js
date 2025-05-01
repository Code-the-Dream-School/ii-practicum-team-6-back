const BadRequestError = require('../errors/bad-request')
const UnauthenticatedError = require('../errors/unauthenticated')
const NotFoundError = require('../errors/not-found')
const buildCommentTree = require('../utils/buildCommentTree')
const Comment = require('../models/comment')

exports.getAllCommentsByTheProjectId = async (projectId) => {

    const comments = await Comment.find({ projectId: projectId }).sort({ createdAt: 1 });
    if (!comments) {
        throw new BadRequestError('Error fetching Comments');
    };
    const commentTree = buildCommentTree(comments)

    return commentTree
}

exports.sendCommentByProjectId = async (projectId, text, parentCommentId, userId) => {

    const comment = await Comment.create({
        text,
        userId: userId,
        projectId,
        likes: [],
        parentComment: parentCommentId || null,
    });
    if (!comment) {
        throw new BadRequestError('Error Sending a Comment');
    };

    return comment
}

