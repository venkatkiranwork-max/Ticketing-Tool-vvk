import { body } from 'express-validator';

const passwordRules = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters')
  .matches(/[a-z]/)
  .withMessage('Password must contain a lowercase letter')
  .matches(/[A-Z]/)
  .withMessage('Password must contain an uppercase letter')
  .matches(/\d/)
  .withMessage('Password must contain a number');

export const registerValidator = [
  body('email').trim().toLowerCase().isEmail().withMessage('Valid email is required'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  passwordRules,
];

export const loginValidator = [
  body('email').trim().toLowerCase().isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const refreshValidator = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
];

export const forgotPasswordValidator = [
  body('email').trim().toLowerCase().isEmail().withMessage('Valid email is required'),
];

export const resetPasswordValidator = [
  body('token').notEmpty().withMessage('Reset token is required'),
  passwordRules,
];

export const logoutValidator = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
];
