const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: {
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
            default: "",
            maxlength: 500,
        },
        avatar: {
            url: {
              type: String,
              required: false,
              default: ""
            },
            public_id: {
              type: String,
              required: false,
              default: ""
            }
          },
        skills: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Skill',
                }
            ],
            default: []
        },
        projectsIds: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Project"
                }
            ],
            default: []
        },
        resetPasswordToken: String,
        resetPasswordExpires: Date
    }, { timestamps: true });

module.exports = mongoose.model('User', userSchema);