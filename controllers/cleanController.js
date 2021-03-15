import expressAsyncHandler from 'express-async-handler';
import { validate, Joi } from 'express-validation';
import { upload } from '../middleware/multerMiddleware.js';
import { auth } from '../middleware/authMiddleware.js';
import Place from '../models/placeModel.js';
import User from '../models/userModel.js';

// @desc        Add infos about cleaning
// @route       POST /api/clean/:id
// @access      Private
// @response    Confirmation message
const addCleaning = [
  auth,
  upload.single('file'),
  // Validation
  validate({
    body: Joi.object({
      description: Joi.string().trim(),
    }),
  }),
  expressAsyncHandler(async (req, res) => {
    const { description } = req.body;
    const path = req.file?.location;

    if (!path) {
      res.status(400);
      throw new Error('Image is required');
    }

    const place = await Place.findById(req.params.id);
    if (!place) {
      res.status(404);
      throw new Error('Place not found');
    } else {
      if (place.cleaned.isCleaned) {
        res.status(400);
        throw new Error('Place already cleaned');
      } else {
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
      }
    }
  }),
];

// @desc        Change infos about cleaning
// @route       PUT /api/clean/:id
// @access      Private / Admin
// @response    Confirmation message
const changeCleaning = [
  auth,
  upload.single('file'),
  // Validation
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
    if (place && place.cleaned.isCleaned) {
      // Make sure user is OP or admin
      const user = await User.findById(req.user.id);
      if (place.cleaned.user.toString() === req.user.id || user.isAdmin) {
        if (path) {
          place.cleaned.imgUrl = path;
        }
        if (description) {
          place.cleaned.description = description;
        }

        await place.save();
        res.status(200).json({ msg: 'Place modified' });
      } else {
        res.status(401);
        throw new Error('Unauthorized');
      }
    } else {
      res.status(404);
      throw new Error('Place does not exist or is not cleaned');
    }
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
    if (place && place.cleaned.isCleaned) {
      // Make sure user is OP or admin
      const user = await User.findById(req.user.id);
      if (place.cleaned.user.toString() === req.user.id || user.isAdmin) {
        place.cleaned.imgUrl = undefined;
        place.cleaned.user = undefined;
        place.cleaned.timestamp = undefined;
        place.cleaned.isCleaned = false;
        place.cleaned.description = undefined;

        await place.save();

        // Delete points from user
        await user.updateOne({ $inc: { points: -50 } });

        res.json({ msg: 'Cleaning infos removed' });
      } else {
        res.status(401);
        throw new Error('Unauthorized');
      }
    } else {
      res.status(404);
      throw new Error('Place is not cleaned or does not exist');
    }
  }),
];

export { addCleaning, changeCleaning, deleteCleaning };
