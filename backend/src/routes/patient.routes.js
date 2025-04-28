const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const patientController = require('../controllers/patient.controller');
const auth = require('../middleware/auth');

// Validation middleware
const validatePatient = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Valid gender is required'),
  body('bloodGroup').notEmpty().withMessage('Blood group is required'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('condition').notEmpty().withMessage('Condition is required')
];

const validateHealthMetrics = [
  body('bloodPressure.systolic').isNumeric().withMessage('Valid systolic pressure is required'),
  body('bloodPressure.diastolic').isNumeric().withMessage('Valid diastolic pressure is required'),
  body('heartRate').isNumeric().withMessage('Valid heart rate is required'),
  body('bloodOxygen').isNumeric().withMessage('Valid blood oxygen is required'),
  body('temperature').isNumeric().withMessage('Valid temperature is required')
];

// Routes
router.get('/', auth, patientController.getAllPatients);
router.get('/:id', auth, patientController.getPatient);
router.post('/', [auth, validatePatient], patientController.createPatient);
router.put('/:id', [auth, validatePatient], patientController.updatePatient);
router.delete('/:id', auth, patientController.deletePatient);

// Health metrics routes
router.post('/:id/health-metrics', [auth, validateHealthMetrics], patientController.addHealthMetrics);
router.get('/:id/health-metrics', auth, patientController.getHealthMetrics);

module.exports = router; 