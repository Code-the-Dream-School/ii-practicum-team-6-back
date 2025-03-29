const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
        projectId: {
            type: Schema.Types.ObjectId,
            ref : "Project"
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref : "User"
        },
        conent: {
            type: String,
            required: true,
            trim: true
        },
       
    }, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);