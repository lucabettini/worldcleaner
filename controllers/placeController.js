import expressAsyncHandler from 'express-async-handler';
import { validate, Joi } from 'express-validation';

import auth from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multerMiddleware.js';
import Place from '../models/placeModel.js';
import User from '../models/userModel.js';

// @desc        Fetch all places
// @route       GET /api/places
// @access      Public
// @response    Array of all places
const getPlaces = expressAsyncHandler(async (req, res) => {
  // Get all places
  const places = await Place.find({}).select(
    'coordinates user name cleaned.isCleaned cleaned.user createdAt'
  );

  res.json(places);
});

// @desc        Add a new place
// @route       POST /api/places
// @access      Private
// @response    New place _id
const addPlace = [
  auth,
  upload.single('file'), // Multer
  validate({
    // Validation
    body: Joi.object({
      name: Joi.string().trim().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      description: Joi.string().trim(),
    }),
  }),
  expressAsyncHandler(async (req, res) => {
    const { name, latitude, longitude } = req.body;
    const path = req.file?.location;

    if (!path) {
      res.status(400);
      throw new Error('Image is required');
    }

    // Add place
    const place = new Place({
      name,
      imgUrl: path,
      coordinates: [parseFloat(latitude), parseFloat(longitude)],
      user: req.user.id,
      description: req.body.description ?? undefined,
    });

    await place.save();

    // Add points to user
    const user = await User.findById(req.user.id);
    await user.updateOne({ $inc: { points: 10 } });

    res.json({ place: place._id });
  }),
];

// @desc        Fetch a single place
// @route       GET /api/places/:id
// @access      Public
// @response    Object with place's data
const getPlaceById = expressAsyncHandler(async (req, res) => {
  const place = await Place.findById(req.params.id);
  if (place) {
    res.json(place);
  } else {
    res.status(404);
    throw new Error('Place not found');
  }
});

// @desc        Modify existing place
// @route       PATCH /api/places/:id
// @access      Private
// @response    Confirmation message
const changePlace = [
  auth,
  upload.single('file'), // Multer
  // Validation
  validate({
    body: Joi.object({
      name: Joi.string().trim(),
      latitude: Joi.number(),
      longitude: Joi.number(),
      description: Joi.string().trim(),
    }),
  }),
  expressAsyncHandler(async (req, res) => {
    const { name, latitude, longitude, description } = req.body;
    console.log(req.body);
    const place = await Place.findById(req.params.id);
    if (!place) {
      res.status(404);
      throw new Error('Place not found');
    }

    // Make sure user is OP
    if (place.user._id.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    // Replace with new values if they exist
    place.name = name ?? place.name;
    place.latitude = latitude ?? place.latitude;
    place.longitude = longitude ?? place.longitude;
    place.description = description ?? place.description;
    place.imgUrl = req.file?.path ?? place.imgUrl;

    await place.save();
    res.status(200).json({ msg: 'Place updated' });
  }),
];

// @desc        Delete existing place
// @route       DELETE /api/places/:id
// @access      Private + Admin
// @response    Confirmation message
const deletePlace = [
  auth,
  expressAsyncHandler(async (req, res) => {
    const place = await Place.findById(req.params.id);
    if (!place) {
      res.status(400);
      throw new Error('Place not found');
    }
    // Check if user is admin
    const user = await User.findById(req.user.id);
    const isAdmin = user.isAdmin;

    // Make sure user is OP or admin
    if (place.user._id.toString() === req.user.id || isAdmin) {
      // Remove place
      await Place.findByIdAndRemove(req.params.id);
      // Remove user's points
      await user.updateOne({ $inc: { points: -10 } });
      if (place.cleaned.isCleaned) {
        const cleanUser = await User.findById(place.cleaned.user);
        await cleanUser.updateOne({ $inc: { points: -50 } });
      }

      res.json({ msg: 'Place removed' });
    } else {
      res.status(401);
      throw new Error('Unauthorized');
    }
  }),
];

export { getPlaces, addPlace, getPlaceById, changePlace, deletePlace };
