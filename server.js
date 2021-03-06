import express from 'express';
import dotenv from 'dotenv';
import * as path from 'path';
import colors from 'colors';

import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db.js';

import placesRoutes from './routes/placesRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cleanRoutes from './routes/cleanRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// DATABASE AND APP CONFIGURATION

dotenv.config();

connectDB();

const app = express();

// GLOBAL MIDDLEWARES

// Parsers
app.use(express.json());
app.use(cookieParser());

// Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Data sanitization
app.use(mongoSanitize());
app.use(xss());

// Rate limiter
const limiter = rateLimit({
  max: process.env.NODE_ENV === 'production' ? 200 : 10000,
  windowMs: 60 * 60 * 1000, // 1h
  message: 'Too many requests from this IP',
});
app.use('/api', limiter);

// ROUTES

// Api
app.use('/api/places', placesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/clean', cleanRoutes);

// Frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile('client/build/index.html', {
      root: path.resolve(path.dirname('')),
    });
  });
}

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// START SERVER

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.cyan
      .bold
  )
);
