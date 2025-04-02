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
            type: String,
            required: true,
            minlength: 6
        },
        reqSpots: {
            type: Number,
            required: true,
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
        reqSkills: [{
            type: Schema.Types.ObjectId,
            ref: "Skill",
            default : []
        }],
        likes: [{
            type: Schema.Types.ObjectId,
            ref: "User",
            default : []
        }]
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

module.exports = mongoose.model('Project', projectSchema);