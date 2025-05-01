function toCommentResponseDto(comment) {
  return {
    id: comment._id,
    projectId: comment.projectId,
    text: comment.text,
    userId: comment.userId,
    parentComment: comment.parentComment,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    replies: comment.replies?.map(toCommentResponseDto) || [],
  };
}

function toCommentsResponseDto(comments) {
  return comments.map(toCommentResponseDto);
}

module.exports = { toCommentResponseDto, toCommentsResponseDto };