import httpStatus from 'http-status-codes';
import TokenGenerator from './token-generator.security';
import { globalErrorHandler } from '../exceptions/global.error';

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const authorized = (req, res, next) => {
  try {
    const token = req.body.token || req.query.token || req.headers.authorization;

    if (!token) {
      globalErrorHandler(
        {
          name: httpStatus.getStatusText(httpStatus.UNAUTHORIZED),
          message: 'Unauthorized User',
        },
        httpStatus.UNAUTHORIZED
      );
    }

    new TokenGenerator(process.env.JWT_PRIVATE_KEY).decode(token);

    next();
  } catch (e) {
    throw e;
  }
};

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const refreshToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization || req.body.token;

    const newToken = new TokenGenerator(process.env.JWT_PRIVATE_KEY).refresh(token);

    res.status(httpStatus.OK).json({
      token: newToken,
    });
  } catch (e) {
    next(e);
  }
};

export { authorized, refreshToken };
