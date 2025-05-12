const Joi = require('joi');

const myProjectRequesstValidator = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Page must be a number',
    'number.min': 'Page must be at least 1',
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.base': 'Limit must be a number',
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit must be no more than 100',
  }),

  status: Joi.string().valid('pending', 'approved', 'declined').optional().messages({
    'string.base': 'Status must be a string',
    'any.only': 'Status must be one of [pending, approved, rejected, in-progress]',
  }),
});

module.exports = {myProjectRequesstValidator};