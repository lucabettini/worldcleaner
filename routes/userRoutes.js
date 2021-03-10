import express from 'express';
import {
  getUsers,
  getUserById,
  registerUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';

const router = express.Router();

router.route('/').get(getUsers).post(registerUser);

router.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser);

export default router;
