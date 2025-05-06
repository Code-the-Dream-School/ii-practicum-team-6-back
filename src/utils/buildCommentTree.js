function buildCommentTree(comments) {
    const map = {};
    const roots = [];
  
    comments.forEach(comment => {
      map[comment._id] = { ...comment._doc, replies: [] };
    });
  
    comments.forEach(comment => {
      if (comment.parentComment) {
        map[comment.parentComment]?.replies.push(map[comment._id]);
      } else {
        roots.push(map[comment._id]);
      }
    });
  
    return roots;
  }
  
  module.exports = buildCommentTree;