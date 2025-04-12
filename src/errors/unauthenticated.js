const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api');

class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

<<<<<<< HEAD
module.exports = UnauthenticatedError;
=======
module.exports = UnauthenticatedError;
>>>>>>> 72788ea (add some validation using joi)
