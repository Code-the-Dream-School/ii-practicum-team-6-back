const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  }

<<<<<<< HEAD
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

=======
>>>>>>> 72788ea (add some validation using joi)
  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',')
    customError.statusCode = 400
  }
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`
    customError.statusCode = 400
  }
  if (err.name === 'CastError') {
<<<<<<< HEAD
    customError.msg = `No item found with id : ${err.value}`
=======
    customError.msg = `No item found with id : ${err.value || 'unknown'}`
>>>>>>> 72788ea (add some validation using joi)
    customError.statusCode = 404
  }

  return res.status(customError.statusCode).json({ msg: customError.msg })
}

<<<<<<< HEAD
module.exports = errorHandlerMiddleware
=======
module.exports = errorHandlerMiddleware
>>>>>>> 72788ea (add some validation using joi)
