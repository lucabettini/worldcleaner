import express from 'express';
import {
  authUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  changePassword,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', authUser);

router.post('/logout', logoutUser);

router.post('/forgotPassword', forgotPassword);

router.patch('/resetPassword/:token', resetPassword);

router.patch('/changePassword', changePassword);

export default router;
