const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            maxlength: 500,
            trim: true,
        },
        createdBy : {
            type: String,
            required: true,
            minlength: 6
        },
        teamMembers: [{
            user: {
              type: Schema.Types.ObjectId,
              ref: "User",  
              required: true,
            },
            role: {
              type: String,
              enum: ["admin", "user"], 
              required: true,
            }
          }],
        tags: {
            type: [String],
        },
        reqSkills: {
            type: [String],
        },
        upvote_count: {
            type: Number,
            default: 0,
        },
        teamNum: {
            type: Number,
            default: 1,
        },
        available_spots: {
            type: Number
        },
        comments: [{
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }],
    }, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);