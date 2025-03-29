const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectRequestSchema = new Schema(
    {
        projectId: {
            type: Schema.Types.ObjectId,
            ref : "Project"
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref : "User"
        },
        status: {
            type: String,
            enum: ["pending", "approved", "declined"], 
            required: true,
        },
       
    }, { timestamps: true });

module.exports = mongoose.model('ProjectRequest', ProjectRequestSchema);