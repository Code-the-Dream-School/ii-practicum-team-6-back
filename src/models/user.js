const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        bio: {
            type: String,
            maxlength: 500,
        },
        skills: {
            type: [String],
            default: [],
        },
        // team_ids: {
        //     type : Schema.Types.ObjectId,
        //     ref : "Team"
        // },
        projects_requests_ids: {
            type: Schema.Types.ObjectId,
            ref: "ProjectRequest"
        },
        projects_ids: {
            type: Schema.Types.ObjectId,
            ref: "Project"
        },
    }, { timestamps: true });

module.exports = mongoose.model('User', userSchema);