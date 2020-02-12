import jwt from 'jsonwebtoken';
import httpStatus from 'http-status-codes';
import { globalErrorHandler } from '../exceptions/global.error';

function TokenGenerator(secretOrPrivateKey) {
  this.secretOrPrivateKey = secretOrPrivateKey;
  this.options = {
    keyid: '1',
    noTimestamp: false,
    expiresIn: +process.env.JWT_EXPIRES_IN,
  };
}

TokenGenerator.prototype.sign = function(payload) {
  const signOptions = {
    audience: 'myaud',
    issuer: 'myissuer',
    jwtid: '1',
    subject: 'user',
  };

  const jwtSignOptions = Object.assign({}, signOptions, this.options);
  const token = jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);

  return { token, expiresIn: this.options.expiresIn };
};

TokenGenerator.prototype.refresh = function(token) {
  try {
    const refreshOptions = {
      verify: {
        audience: 'myaud',
        issuer: 'myissuer',
      },
      jwtid: '2',
    };

    const payload = jwt.verify(token, this.secretOrPrivateKey, refreshOptions.verify);

    delete payload.iat;
    delete payload.exp;
    delete payload.nbf;
    delete payload.jti;

    const jwtSignOptions = Object.assign({}, this.options, {
      jwtid: refreshOptions.jwtid,
    });

    const tokenRefresh = jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
    return { token: tokenRefresh, expiresIn: this.options.expiresIn };
  } catch (error) {
    globalErrorHandler(
      {
        name: httpStatus.getStatusText(httpStatus.UNAUTHORIZED),
        message: 'Unauthorized User',
      },
      httpStatus.UNAUTHORIZED
    );
  }
};

TokenGenerator.prototype.decode = function(accessToken) {
  try {
    return jwt.verify(accessToken, process.env.JWT_PRIVATE_KEY);
  } catch (error) {
    globalErrorHandler(
      {
        name: httpStatus.getStatusText(httpStatus.UNAUTHORIZED),
        message: 'Unauthorized User',
      },
      httpStatus.UNAUTHORIZED
    );
  }
};

export default TokenGenerator;
