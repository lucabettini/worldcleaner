import { ValidationError } from 'express-validation';

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // Checks for validation errors
  if (err instanceof ValidationError) {
    res.status(err.statusCode).json({
      msg: err,
    });
    console.log(req.body);
  } else {
    res.json({
      msg: err.message,
    });
  }
};

export { notFound, errorHandler };
