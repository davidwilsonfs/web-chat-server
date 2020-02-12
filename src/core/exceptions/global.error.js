import AppError from './app.error';

const globalErrorHandler = (error, errorCode) => {
  throw new AppError(error, errorCode);
};

export { globalErrorHandler };
