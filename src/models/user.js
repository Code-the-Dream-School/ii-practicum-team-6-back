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
            minlength: 10,
            maxlength: 500,
        },
        avatar: {
            type: String,
            default: ""
        },
        skills: [{
            type: Schema.Types.ObjectId,
            ref: "Skills",
            default: []
        }],
        projectsIds: [{
            type: Schema.Types.ObjectId,
            ref: "Project",
            default: []
        }]
    }, { timestamps: true });

module.exports = mongoose.model('User', userSchema);