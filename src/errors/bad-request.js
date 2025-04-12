const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api');

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

<<<<<<< HEAD
module.exports = BadRequestError;
=======
module.exports = BadRequestError;
>>>>>>> 72788ea (add some validation using joi)
