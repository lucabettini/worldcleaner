import express from 'express';
import {
  addCleaning,
  changeCleaning,
  deleteCleaning,
} from '../controllers/cleanController.js';

const router = express.Router();

router
  .route('/:id')
  .post(addCleaning)
  .patch(changeCleaning)
  .delete(deleteCleaning);

export default router;
