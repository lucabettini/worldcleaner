import crypto from 'crypto';
import expressAsyncHandler from 'express-async-handler';
import { validate, Joi } from 'express-validation';
import bcrypt from 'bcryptjs';
import sgMail from '@sendgrid/mail';

import User from '../models/userModel.js';

import { auth, sendToken } from '../middleware/authMiddleware.js';

// @desc        Login user & get token
// @route       POST /api/auth/login
// @access      Public
// @response    User id and adminstatus
const authUser = [
  validate({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),

  expressAsyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const isMatch = await user.matchPassword(password);
    if (!isMatch) throw new Error('Invalid password');

    req.tokenInfo = {
      id: user.id,
      isAdmin: user.isAdmin,
    };
    next();
  }),

  sendToken,
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

// @desc        Forgot password request
// @route       POST /api/auth/forgotPassword
// @access      Public
// @response    Success message
const forgotPassword = [
  validate({
    body: Joi.object({
      email: Joi.string().email().required(),
    }),
  }),

  expressAsyncHandler(async (req, res) => {
    // Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error('User not found');
    if (user.isAdmin) throw new Error('Operation not available for admins');

    // Generate random token
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Send hash token to db
    user.pswResetToken = hashedToken;
    user.pswResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    //Send email
    const resetURL = `${process.env.BASE_URL}/resetPassword/${token}`;
    sgMail.setApiKey(process.env.EMAIL_API_KEY);
    const msg = {
      to: user.email,
      from: 'noreply@worldcleaner.lucabettini.com',
      subject: 'Change World Cleaner password',
      html: `<h3>To reset your password, <a href='${resetURL}'>click here.</a></h3><p>Otherwise ignore this message</p>`,
    };

    try {
      await sgMail.send(msg);

      res.json({
        msg: 'Token sent to email',
      });
    } catch (error) {
      // Manually delete tokens in case of error
      user.pswResetToken = undefined;
      user.pswResetExpires = undefined;
      await user.save();
      throw new Error('Error sending the email');
    }
  }),
];

// @desc        Reset password
// @route       PATCH /api/auth/resetPassword/:token
// @access      Public
// @response    User id and adminstatus
const resetPassword = [
  validate({
    body: Joi.object({
      password: Joi.string().required(),
    }),
  }),

  expressAsyncHandler(async (req, res) => {
    // Check if token is still valid
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      pswResetToken: hashedToken,
      pswResetExpires: { $gt: Date.now() },
    });

    if (!user) throw new Error('Invalid token');

    // Update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.pswResetToken = undefined;
    user.pswResetExpires = undefined;
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

// @desc        Change password (while logged in)
// @route       PATCH /api/auth/changePassword
// @access      Private
// @response    Confirmation message
const changePassword = [
  auth,

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
    if (!isMatch) throw new Error('Old password not valid');

    // Save the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ msg: 'Password changed' });
  }),
];

export { authUser, logoutUser, forgotPassword, resetPassword, changePassword };
