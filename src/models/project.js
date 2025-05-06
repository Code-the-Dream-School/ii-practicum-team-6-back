const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },
        description: {
            type: String,
            required: true,
            maxlength: 500,
            trim: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required : true
        },
        reqSpots: {
            type: Number,
            required: true,
            min : 1,
            default : 1
        },
        teamMembers: {
            type: [
                {
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
                }
            ],
            default: []
        },
        reqSkills: {
            type: [Schema.Types.ObjectId],
            ref: "Skill",
            default : []
        },
        likes: {
            type: [Schema.Types.ObjectId],
            ref: "User",
            default : []
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

projectSchema.virtual('teamNum').get(function () {
    return this.teamMembers.length;
});
projectSchema.virtual('availableSpots').get(function () {
    return this.reqSpots - (this.teamMembers ? this.teamMembers.length : 0);
});
// Create a text index for searching
projectSchema.index({ title: 'text', description: 'text'});

module.exports = mongoose.model('Project', projectSchema);