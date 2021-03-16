import expressAsyncHandler from 'express-async-handler';
import { validate, Joi } from 'express-validation';
import bcrypt from 'bcryptjs';

import User from '../models/userModel.js';

import { auth, sendToken } from '../middleware/authMiddleware.js';

// @desc        Get all users
// @route       GET /api/users
// @access      Public
// @response    Array of all users' name and points
const getUsers = expressAsyncHandler(async (req, res) => {
  // Get only username, points, admin stat and timestamp
  const users = await User.find({}).select('name points isAdmin createdAt');

  res.json(users);
});

// @desc        Register a new user
// @route       POST /api/users
// @access      Public
// @response    User id and adminstatus
const registerUser = [
  validate({
    body: Joi.object({
      name: Joi.string().trim().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),

  expressAsyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    const sameEmail = await User.findOne({ email });
    if (sameEmail) throw new Error('Email already exists');

    let user = new User({
      name,
      email,
      password,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Login user
    req.tokenInfo = {
      id: user.id,
      isAdmin: user.isAdmin,
    };
    next();
  }),
  sendToken,
];

// @desc        Fetch a single user
// @route       GET /api/users/:id
// @access      Public
// @response    Object with user's data
const getUserById = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -email');
  if (!user) throw new Error('User not found');

  res.json(user);
});

// @desc        Update user data
// @route       PATCH /api/users/:id
// @access      Private
// @response    Success message
const updateUser = [
  auth,

  validate({
    body: Joi.object({
      name: Joi.string().trim(),
      location: Joi.string().trim(),
      description: Joi.string().trim(),
    }),
  }),

  expressAsyncHandler(async (req, res) => {
    const { name, location, description } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) throw new Error('User not found');

    // Check if user is the same
    if (req.user.id !== req.params.id) throw new Error('Unauthorized');

    // Update data
    if (name) user.name = name;
    if (location) user.location = location;
    if (description) user.description = description;
    await user.save();

    res.status(200).json({ msg: 'User updated', user: user });
  }),
];

// @desc        Delete user data
// @route       DELETE /api/users/:id
// @access      Private / Admin
// @response    Success message
const deleteUser = [
  auth,

  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    const updater = await User.findById(req.user.id);
    if (!user) throw new Error('User not found');

    // Check is user is admin or authorized
    if (req.user.id !== req.params.id && !updater.isAdmin) {
      throw new Error('Unauthorized');
    }

    await User.findByIdAndRemove(req.params.id);

    res.json({ msg: 'User removed' });
  }),
];

export { getUsers, getUserById, registerUser, updateUser, deleteUser };
