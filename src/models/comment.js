const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },
        text: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        likes: {
            type: [Schema.Types.ObjectId],
            ref: "User",
            default: []
        },
        parentComment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
            default: null
        },
        // replies: {
        //     type: [Schema.Types.ObjectId],
        //     ref: "Comment",
        //     default: []
        // },


    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    },
);

commentSchema.virtual('likesCount').get(function () {
    return this.likes.length;
});


module.exports = mongoose.model('Comment', commentSchema);