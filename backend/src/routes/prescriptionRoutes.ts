import express from 'express';
import { prescriptionController } from '../controllers/prescriptionController';
import { auth, checkRole } from '../middleware/auth';
import { validatePrescription } from '../middleware/validation';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth);

// Get all prescriptions
router.get('/', prescriptionController.getAllPrescriptions);

// Get single prescription
router.get('/:id', prescriptionController.getPrescription);

// Create prescription (only doctors can create)
router.post(
  '/',
  checkRole(['doctor']),
  validatePrescription,
  prescriptionController.createPrescription
);

// Update prescription (only doctors can update)
router.put(
  '/:id',
  checkRole(['doctor']),
  validatePrescription,
  prescriptionController.updatePrescription
);

// Delete prescription (only doctors can delete)
router.delete(
  '/:id',
  checkRole(['doctor']),
  prescriptionController.deletePrescription
);

export const prescriptionRoutes = router; 