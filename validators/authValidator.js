const { body } = require('express-validator');
const User = require('../models/User'); // adjust path if needed

exports.registerValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required'),

  body('email')
  .notEmpty()
  .withMessage('Email is required')
  .bail()
  .isEmail()
  .withMessage('Please provide a valid email')
  .bail()
  .custom(async (email) => {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email is already in use');
    }
  }),


  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[\W_]/)
    .withMessage('Password must contain at least one special character'),
];


exports.loginValidation = [

  body('email')
  .notEmpty()
  .withMessage('Email is required')
  .bail()
  .isEmail()
  .withMessage('Please provide a valid email'),


  body('password')
    .notEmpty()
    .withMessage('Password is required')
];
