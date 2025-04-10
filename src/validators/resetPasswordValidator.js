const Joi = require('joi')

const resetPasswordSchema = Joi.object({
    newPassword: Joi.string().min(8).required(),
    confirmPassword: Joi.any().valid(Joi.ref('newPassword')).required()
      .messages({ 'any.only': 'Passwords doesnt match' }),
  });

  module.exports = resetPasswordSchema;