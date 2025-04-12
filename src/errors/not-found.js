const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api');

class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

<<<<<<< HEAD
module.exports = NotFoundError;
=======
module.exports = NotFoundError;
>>>>>>> 72788ea (add some validation using joi)
