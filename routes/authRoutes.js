import express from 'express';
import {
  authUser,
  forgotPassword,
  resetPassword,
  changePassword,
  logoutUser,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', authUser);

router.post('/logout', logoutUser);

router.post('/forgotPassword', forgotPassword);

router.patch('/resetPassword/:token', resetPassword);

router.patch('/changePassword', changePassword);

export default router;
