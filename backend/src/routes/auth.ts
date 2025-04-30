import express from 'express';
import { body } from 'express-validator';
import { login, register, refreshToken } from '../controllers/authController';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

// Login route
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  login
);

// Register route
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('name').notEmpty().withMessage('Name is required'),
    body('userType')
      .isIn(['patient', 'doctor', 'admin'])
      .withMessage('Invalid user type'),
  ],
  validateRequest,
  register
);

// Refresh token route
router.post('/refresh-token', refreshToken);

export default router; 