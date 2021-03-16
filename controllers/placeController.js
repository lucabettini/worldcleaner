import expressAsyncHandler from 'express-async-handler';
import { validate, Joi } from 'express-validation';

import { auth } from '../middleware/authMiddleware.js';
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

  upload.single('file'),

  validate({
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

    if (!path) throw new Error('Image is required');

    // Add a new place
    const place = new Place({
      name,
      imgUrl: path,
      coordinates: [parseFloat(latitude), parseFloat(longitude)],
      user: req.user.id,
      description: req.body.description ?? undefined, // Desc is not required
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
  if (!place) throw new Error('Place not found');

  res.json(place);
});

// @desc        Modify existing place
// @route       PATCH /api/places/:id
// @access      Private / Admin
// @response    Confirmation message
const changePlace = [
  auth,

  upload.single('file'),

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
    const place = await Place.findById(req.params.id);
    const user = await User.findById(place.user);

    if (!place) throw new Error('Place not found');

    // Make sure user is OP or Admin
    if (place.user._id.toString() !== req.user.id && !user.isAdmin) {
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
// @access      Private / Admin
// @response    Confirmation message
const deletePlace = [
  auth,

  expressAsyncHandler(async (req, res) => {
    const place = await Place.findById(req.params.id);
    const user = await User.findById(place.user);

    if (!place) throw new Error('Place not found');

    // Make sure user is OP or Admin
    if (place.user._id.toString() !== req.user.id && !user.isAdmin) {
      throw new Error('Unauthorized');
    }

    // Remove place
    await Place.findByIdAndRemove(req.params.id);

    // Remove user's points
    await user.updateOne({ $inc: { points: -10 } });
    if (place.cleaned.isCleaned) {
      const cleanUser = await User.findById(place.cleaned.user);
      await cleanUser.updateOne({ $inc: { points: -50 } });
    }

    res.json({ msg: 'Place removed' });
  }),
];

export { getPlaces, addPlace, getPlaceById, changePlace, deletePlace };
