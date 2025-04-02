const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique : true,
            trim : true
        },
        category: {
            type: String,
            required: true,
        },
    } );

module.exports = mongoose.model('Skill', skillSchema);