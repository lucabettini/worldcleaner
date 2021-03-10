import crypto from 'crypto';
import expressAsyncHandler from 'express-async-handler';
import { validate, Joi } from 'express-validation';
import bcrypt from 'bcryptjs';
import nodemail from 'nodemailer';

import User from '../models/userModel.js';

import auth, { sendToken } from '../middleware/authMiddleware.js';

// @desc        Auth user & get token
// @route       POST /api/auth/login
// @access      Public
// @response    User id and name
const authUser = [
  // Login validation
  validate({
    // Validation
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),

  expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error('User not found');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid password');
    }

    // JWT
    sendToken(user, res);
  }),
];

// @desc        Forgot password request
// @route       POST /api/auth/forgotPassword
// @access      Public
// @response    Success message
const forgotPassword = [
  // Validation
  validate({
    body: Joi.object({
      email: Joi.string().email().required(),
    }),
  }),
  expressAsyncHandler(async (req, res) => {
    // Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error('User not found');

    // Generate random token
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Send hash token to db
    user.pswResetToken = hashedToken;
    user.pswResetExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send token
    const resetURL = `http://localhost:3000/resetPassword/${token}`;

    console.log(process.env.EMAIL_USERNAME);

    // Transporter
    const transporter = nodemail.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PSW,
      },
    });

    try {
      await transporter.sendMail({
        to: user.email,
        from: 'worldcleanerwebsite@gmail.com',
        subject: 'Change World Cleaner password',
        html: `<h3>To reset your password, <a href='${resetURL}'>click here.</a></h3><p>Otherwise ignore this message</p>`,
      });

      res.status(200).json({
        msg: 'Token sent to email',
      });
    } catch (error) {
      user.pswResetToken = undefined;
      user.pswResetExpires = undefined;
      await user.save();
      console.log(error);
      throw new Error('Error sending the email');
    }
  }),
];

// @desc        Reset password
// @route       PATCH /api/auth/resetPassword/:token
// @access      Public
// @response    User id and name
const resetPassword = [
  // Validation
  validate({
    body: Joi.object({
      password: Joi.string().required(),
    }),
  }),
  expressAsyncHandler(async (req, res) => {
    console.log(req.body.password);
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // Check if token is still valid
    const user = await User.findOne({
      pswResetToken: hashedToken,
      pswResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(401);
      throw new Error('Invalid token');
    }

    // Update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.pswResetToken = undefined;
    user.pswResetExpires = undefined;
    await user.save();

    // Log in user
    sendToken(user, res);
  }),
];

// @desc        Change password (while logged in)
// @route       PATCH /api/auth/changePassword
// @access      Private
// @response    Confirmation message
const changePassword = [
  auth,
  // Validation
  validate({
    body: Joi.object({
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().required(),
    }),
  }),
  expressAsyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    // Check the old password
    const isMatch = user.matchPassword(oldPassword);
    if (!isMatch) {
      res.status(401);
      throw new Error('Old password not valid');
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ msg: 'Password changed' });
  }),
];

// @desc        Logout user
// @route       POST /api/auth/logout
// @access      Private
// @response    Confirmation message
const logoutUser = [
  auth,
  (req, res) => {
    res.clearCookie('jwt');
    res.json({ msg: 'Logout successfull' });
  },
];

export { authUser, forgotPassword, resetPassword, changePassword, logoutUser };
