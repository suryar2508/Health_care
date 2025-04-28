const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const medicationController = require('../controllers/medication.controller');
const auth = require('../middleware/auth');
const { medicationAuth, canPrescribe, canRecordAdherence } = require('../middleware/medicationAuth');

// Validation middleware
const validateMedication = [
  body('patient').isMongoId().withMessage('Valid patient ID is required'),
  body('name').trim().notEmpty().withMessage('Medication name is required'),
  body('dosage').trim().notEmpty().withMessage('Dosage is required'),
  body('frequency').trim().notEmpty().withMessage('Frequency is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').optional().isISO8601().withMessage('Invalid end date format'),
  body('status').optional().isIn(['active', 'completed', 'discontinued']).withMessage('Invalid status'),
  body('notes').optional().trim()
];

const validateAdherence = [
  body('taken').isBoolean().withMessage('Taken status is required'),
  body('notes').optional().trim()
];

// Public routes (require authentication)
router.get('/', auth, medicationController.getAllMedications);
router.get('/patient/:patientId', auth, medicationController.getPatientMedications);

// Protected routes (require specific authorization)
router.get('/:id', [auth, medicationAuth], medicationController.getMedication);
router.post('/', [auth, canPrescribe, validateMedication], medicationController.createMedication);
router.put('/:id', [auth, medicationAuth, canPrescribe, validateMedication], medicationController.updateMedication);
router.delete('/:id', [auth, medicationAuth, canPrescribe], medicationController.deleteMedication);

// Adherence routes
router.post('/:id/adherence', [auth, medicationAuth, canRecordAdherence, validateAdherence], medicationController.recordAdherence);
router.get('/:id/adherence-report', [auth, medicationAuth], medicationController.getAdherenceReport);

module.exports = router; 