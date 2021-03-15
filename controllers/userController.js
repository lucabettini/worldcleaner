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
    // Validation
    body: Joi.object({
      name: Joi.string().trim().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  expressAsyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    const sameEmail = await User.findOne({ email });
    if (sameEmail) {
      res.status(400);
      throw new Error('Email already exists');
    }

    let user = new User({
      name,
      email,
      password,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

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
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc        Update user data
// @route       PATCH /api/users/:id
// @access      Private
// @response    Success message
const updateUser = [
  auth,
  // Validation
  validate({
    // Validation
    body: Joi.object({
      name: Joi.string().trim(),
      location: Joi.string().trim(),
      description: Joi.string().trim(),
    }),
  }),

  expressAsyncHandler(async (req, res) => {
    const { name, location, description } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    } else {
      // Check if user is the same
      if (req.user.id === req.params.id) {
        // Update user data
        if (name) {
          user.name = name;
        }
        if (location) {
          user.location = location;
        }
        if (description) {
          user.description = description;
        }
        await user.save();
        res.status(200).json({ msg: 'User updated', user: user });
      } else {
        res.status(401);
        throw new Error('Unauthorized');
      }
    }
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
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    } else {
      // Check is user is admin or authorized
      if (req.user.id === req.params.id || updater.isAdmin) {
        await User.findByIdAndRemove(req.params.id);
        res.json({ msg: 'User removed' });
      } else {
        res.status(401);
        throw new Error('Unauthorized');
      }
    }
  }),
];

export {
  getUsers,
  getUserById,
  registerUser,
  updateUser,
  deleteUser,
  sendToken,
};
