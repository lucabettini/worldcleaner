import { ValidationError } from 'express-validation';

const errorMessages = {
  badReq: [
    // Catched by client
    'Email already exists',
    'User not found',
    `Email doesn't exists`,
    'Operation not available for admins',
    // Dev only
    'Image is required',
    'Place already cleaned',
    'Image format not valid',
  ],
  authDenied: [
    'Token not valid',
    'Invalid password',
    'Invalid token',
    'Old password not valid',
    'Unauthorized',
  ],
  notFound: [
    'Place not found',
    'Place is not cleaned or does not exist',
    'Place does not exist or is not cleaned',
  ],
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Express error middleware must always take four arguments
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  if (err instanceof ValidationError) {
    // Error is thrown by validator
    res.status(err.statusCode).json({
      msg: err,
    });
  } else {
    // Error is thrown manually

    // Change status - indexOf returns -1 if the search value never occurs
    if (errorMessages.badReq.indexOf(err.message) > -1) {
      res.status(400);
    } else if (errorMessages.authDenied.indexOf(err.message) > -1) {
      res.status(401);
    } else if (errorMessages.notFound.indexOf(err.message) > -1) {
      res.status(404);
    }

    res.json({
      msg: err.message,
    });
  }
};

export { notFound, errorHandler };
