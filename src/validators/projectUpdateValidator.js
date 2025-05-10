const Joi = require('joi');

const projectUpdateValidator = Joi.object({
  title: Joi.string().trim().max(50),
  description: Joi.string().trim().max(500),
  reqSpots: Joi.number().min(1),

  reqSkills: Joi.array().items(Joi.string()).required(),

  teamMembers: Joi.array().items(
    Joi.object({
      user: Joi.string().hex().length(24).required(),
      role: Joi.string().valid('admin', 'user').required()
    })
  ),

  likes: Joi.array()
    .items(Joi.string().hex().length(24))
}).min(1); 

module.exports = { projectUpdateValidator };