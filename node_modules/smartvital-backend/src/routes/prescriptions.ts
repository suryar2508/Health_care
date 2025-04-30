import express from 'express';
import { auth } from '../middleware/auth';
import {
  getAllPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
  refillPrescription,
} from '../controllers/prescriptionController';

const router = express.Router();

// Get all prescriptions
router.get('/', auth(['admin', 'doctor']), getAllPrescriptions);

// Get prescription by ID
router.get('/:id', auth(['admin', 'doctor', 'patient']), getPrescriptionById);

// Create new prescription
router.post('/', auth(['admin', 'doctor']), createPrescription);

// Update prescription
router.put('/:id', auth(['admin', 'doctor']), updatePrescription);

// Delete prescription
router.delete('/:id', auth(['admin']), deletePrescription);

// Refill prescription
router.post('/:id/refill', auth(['admin', 'doctor', 'patient']), refillPrescription);

export default router; 