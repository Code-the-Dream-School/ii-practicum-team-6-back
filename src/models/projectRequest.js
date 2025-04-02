const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectRequestSchema = new Schema(
    {
        projectId: {
            type: Schema.Types.ObjectId,
            ref : "Project",
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref : "User",
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "approved", "declined"], 
            required: true,
            default: "pending"
        },
        joinMessage: {
            type: String,
            required: true,
            minlength: 10,
            maxlength: 500,
        },
    }, { timestamps: true });

module.exports = mongoose.model('ProjectRequest', ProjectRequestSchema);