const Joi = require('joi');
const mongoose = require('mongoose');

const commentSchema = Joi.object({
    text: Joi.string().min(1).required(),
    parentCommentId: Joi.string()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.error('any.invalid');
        }
        return value;
      })
      .optional()
      .messages({
        'any.invalid': 'Invalid parentComment format',
      }),
  });
  

module.exports = commentSchema;