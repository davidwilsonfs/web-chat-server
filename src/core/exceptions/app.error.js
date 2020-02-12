import util from 'util';
import httpStatus from 'http-status-codes';

/**
 * @description Error Handler App
 * @param {message, statusCode}
 */
function AppError(error, statusCode) {
  Error.captureStackTrace(this, this.constructor);
  this.name = error.name || this.constructor.name;
  this.code = error.code;
  this.message =
    error.message || error || httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR);
  this.statusCode = statusCode || httpStatus.INTERNAL_SERVER_ERROR;
}

util.inherits(AppError, Error);

export default AppError;
