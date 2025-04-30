import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateAppointment = [
  body('patientId').isMongoId().withMessage('Invalid patient ID'),
  body('doctorId').isMongoId().withMessage('Invalid doctor ID'),
  body('date').isISO8601().withMessage('Invalid date format'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format'),
  body('type').isIn(['consultation', 'follow-up', 'check-up', 'emergency']).withMessage('Invalid appointment type'),
  body('notes').optional().isString().trim(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validatePrescription = [
  body('patientId').isMongoId().withMessage('Invalid patient ID'),
  body('medications').isArray().withMessage('Medications must be an array'),
  body('medications.*.name').isString().trim().notEmpty().withMessage('Medication name is required'),
  body('medications.*.dosage').isString().trim().notEmpty().withMessage('Dosage is required'),
  body('medications.*.frequency').isString().trim().notEmpty().withMessage('Frequency is required'),
  body('medications.*.duration').isString().trim().notEmpty().withMessage('Duration is required'),
  body('medications.*.instructions').optional().isString().trim(),
  body('notes').optional().isString().trim(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateUser = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name').isString().trim().notEmpty().withMessage('Name is required'),
  body('userType').isIn(['admin', 'doctor', 'patient', 'pharmacist']).withMessage('Invalid user type'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
]; 