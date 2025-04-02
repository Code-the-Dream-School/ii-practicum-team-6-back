const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
    } );

module.exports = mongoose.model('Skill', skillSchema);