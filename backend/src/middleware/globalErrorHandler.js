import AppError from '../utils/appError.js';

const handleDBError = (err) => {
  if (err.code === 'ER_DUP_ENTRY') {
    const match = err.message.match(/for key '(.+?)'/);
    const field = match ? match[1] : 'field';
    return new AppError(`Duplicate value for ${field}. Please use a different value.`, 400);
  }
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return new AppError('Referenced record does not exist.', 400);
  }
  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return new AppError('Cannot delete: record is referenced by other data.', 400);
  }
  return null;
};

const handleJWTError = () => new AppError('Invalid token. Please log in again.', 401);
const handleJWTExpiredError = () => new AppError('Token expired. Please log in again.', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('UNEXPECTED ERROR:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err, message: err.message, code: err.code };

    const dbError = handleDBError(error);
    if (dbError) error = dbError;
    else if (error.name === 'JsonWebTokenError') error = handleJWTError();
    else if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;