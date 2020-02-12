import httpStatus from 'http-status-codes';
import { validationResult } from 'express-validator/check';
import { globalErrorHandler } from './global.error';

/**
 * Avalia se os parametros passados no request estão corretos
 * @param {Request} request
 */
const validateError = request => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    globalErrorHandler(errors.array({ onlyFirstError: true }), httpStatus.BAD_REQUEST);
  }
};

export { validateError };
