const Joi = require('joi');

const projectCreateValidation = Joi.object({
  title: Joi.string().trim().max(50).required(),
  description: Joi.string().trim().max(500).required(),
  reqSpots: Joi.number().min(1).required(),
  
  reqSkills: Joi.array()
    .items(Joi.string().hex().length(24)) 
    .default([]),

  teamMembers: Joi.array().items(
    Joi.object({
      user: Joi.string().hex().length(24).required(),
      role: Joi.string().valid('admin', 'user').required()
    })
  ).default([]),

  likes: Joi.array()
    .items(Joi.string().hex().length(24)) 
    .default([])
});

module.exports = {projectCreateValidation}