const Joi = require('joi')

const userIdSchema = Joi.object({
    id: Joi.string().length(24).hex().required()
  });

  module.exports = userIdSchema;