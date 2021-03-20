import expressAsyncHandler from 'express-async-handler';
import { validate, Joi } from 'express-validation';

import Place from '../models/placeModel.js';
import User from '../models/userModel.js';

import { upload } from '../middleware/multerMiddleware.js';
import { auth } from '../middleware/authMiddleware.js';

// @desc        Add infos about cleaning
// @route       POST /api/clean/:id
// @access      Private
// @response    Confirmation message
const addCleaning = [
  auth,

  upload.single('file'),

  validate({
    body: Joi.object({
      description: Joi.string().trim(),
    }),
  }),

  expressAsyncHandler(async (req, res) => {
    const { description } = req.body;
    const path = req.file?.location;

    if (!path) throw new Error('Image is required');

    const place = await Place.findById(req.params.id);
    if (!place) throw new Error('Place not found');
    if (place.cleaned.isCleaned) throw new Error('Place already cleaned');

    // Change fields
    place.cleaned.user = req.user.id;
    place.cleaned.imgUrl = path;
    place.cleaned.timestamp = Date.now();
    place.cleaned.isCleaned = true;
    place.cleaned.description = description ?? undefined;
    await place.save();

    // Add points to user
    const user = await User.findById(req.user.id);
    await user.updateOne({ $inc: { points: 50 } });

    res.status(200).json({ msg: 'Place cleaned' });
  }),
];

// @desc        Change infos about cleaning
// @route       PATCH /api/clean/:id
// @access      Private / Admin
// @response    Confirmation message
const changeCleaning = [
  auth,

  upload.single('file'),

  validate({
    body: Joi.object({
      description: Joi.string().trim(),
    }),
  }),

  expressAsyncHandler(async (req, res) => {
    const { description } = req.body;
    const path = req.file?.location;

    const place = await Place.findById(req.params.id);

    // Make sure place exists and was cleaned
    if (!place || !place.cleaned.isCleaned) {
      throw new Error('Place does not exist or is not cleaned');
    }

    // Make sure user is OP or Admin
    if (place.user._id.toString() !== req.user.id && !user.isAdmin) {
      throw new Error('Unauthorized');
    }

    // Change fields
    if (path) place.cleaned.imgUrl = path;
    if (description) place.cleaned.description = description;
    await place.save();

    res.status(200).json({ msg: 'Place modified' });
  }),
];

// @desc        Delete infos about cleaning
// @route       DELETE /api/clean/:id
// @access      Private / Admin
// @response    Confirmation message
const deleteCleaning = [
  auth,

  expressAsyncHandler(async (req, res) => {
    const place = await Place.findById(req.params.id);
    if (!place || !place.cleaned.isCleaned)
      throw new Error('Place is not cleaned or does not exist');

    // Make sure user is OP or Admin
    if (place.user._id.toString() !== req.user.id && !user.isAdmin) {
      throw new Error('Unauthorized');
    }

    // Reset all fields
    place.cleaned.imgUrl = undefined;
    place.cleaned.user = undefined;
    place.cleaned.timestamp = undefined;
    place.cleaned.isCleaned = false;
    place.cleaned.description = undefined;
    await place.save();

    // Delete points from user
    await user.updateOne({ $inc: { points: -50 } });

    res.json({ msg: 'Cleaning infos removed' });
  }),
];

export { addCleaning, changeCleaning, deleteCleaning };
