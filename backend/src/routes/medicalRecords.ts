import express from 'express';
import { auth } from '../middleware/auth';
import {
  getAllMedicalRecords,
  getMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
} from '../controllers/medicalRecordController';

const router = express.Router();

// Get all medical records
router.get('/', auth(['admin', 'doctor']), getAllMedicalRecords);

// Get medical record by ID
router.get('/:id', auth(['admin', 'doctor', 'patient']), getMedicalRecordById);

// Create new medical record
router.post('/', auth(['admin', 'doctor']), createMedicalRecord);

// Update medical record
router.put('/:id', auth(['admin', 'doctor']), updateMedicalRecord);

// Delete medical record
router.delete('/:id', auth(['admin']), deleteMedicalRecord);

export default router; 