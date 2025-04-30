import express from 'express';
import { auth } from '../middleware/auth';
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from '../controllers/doctorController';

const router = express.Router();

// Get all doctors
router.get('/', auth(['admin', 'patient']), getAllDoctors);

// Get doctor by ID
router.get('/:id', auth(['admin', 'doctor', 'patient']), getDoctorById);

// Create new doctor
router.post('/', auth(['admin']), createDoctor);

// Update doctor
router.put('/:id', auth(['admin', 'doctor']), updateDoctor);

// Delete doctor
router.delete('/:id', auth(['admin']), deleteDoctor);

export default router; 