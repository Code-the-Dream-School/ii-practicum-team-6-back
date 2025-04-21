const Joi = require('joi');

const projectUpdateValidation = Joi.object({
  title: Joi.string().trim().max(50),
  description: Joi.string().trim().max(500),
  reqSpots: Joi.number().min(1),

  reqSkills: Joi.array()
    .items(Joi.string().hex().length(24)),

  teamMembers: Joi.array().items(
    Joi.object({
      user: Joi.string().hex().length(24).required(),
      role: Joi.string().valid('admin', 'user').required()
    })
  ),

  likes: Joi.array()
    .items(Joi.string().hex().length(24))
}).min(1); // <-- this ensures at least one field is sent in PATCH

module.exports = { projectUpdateValidation };