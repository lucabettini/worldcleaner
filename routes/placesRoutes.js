import express from 'express';
import {
  getPlaces,
  getPlaceById,
  addPlace,
  changePlace,
  deletePlace,
} from '../controllers/placeController.js';

const router = express.Router();

router.route('/').get(getPlaces).post(addPlace);

router.route('/:id').get(getPlaceById).patch(changePlace).delete(deletePlace);

export default router;
