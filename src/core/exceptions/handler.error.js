import httpStatus from 'http-status-codes';

function Handler() {
  this.error = error => {
    if (process.env.NODE_ENV !== 'test') console.log(error);
  };
}

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  new Handler().error(err);

  const status = err.statusCode ? err.statusCode : httpStatus.INTERNAL_SERVER_ERROR;
  const errorType = err.name ? err.name : 'Exception';
  const message = err.message || err || httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR);

  res.status(status).json({ errors: [{ errorType, message }] });
};

const configErrorHandler = app => {
  app.use(errorHandler);
};

export default configErrorHandler;
