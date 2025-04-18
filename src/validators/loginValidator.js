const Joi = require('joi');

const loginSchema = Joi.object({
    email: Joi.string()
        .min(3)
        .max(30)
        .email()
        .required(),
    password: Joi.string()
        .min(3)
        .max(15)
        .pattern(new RegExp('^[a-zA-Z0-9]+$'))
        .required(),
});

module.exports = loginSchema;