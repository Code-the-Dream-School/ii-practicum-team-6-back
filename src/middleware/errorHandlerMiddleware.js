const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {
  let status = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Something went wrong, try again later';

  // Handle validation errors from Mongoose
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map((item) => item.message).join(', ');
    status = StatusCodes.BAD_REQUEST;
  }

  // Handle duplicate key errors from Mongoose
  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value entered for ${field} field. Please use another value.`;
    status = StatusCodes.BAD_REQUEST;
  }

  // Handle invalid ObjectId errors (e.g., malformed Mongo IDs)
  if (err.name === 'CastError') {
    message = `No item found with id: ${err.value || 'unknown'}`;
    status = StatusCodes.NOT_FOUND;
  }

  return res.status(status).json({
    success: false,
    status,
    message,
  });
};

module.exports = errorHandlerMiddleware;