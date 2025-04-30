import express from 'express';
import { appointmentController } from '../controllers/appointmentController';
import { auth, checkRole } from '../middleware/auth';
import { validateAppointment } from '../middleware/validation';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth);

// Get all appointments
router.get('/', appointmentController.getAllAppointments);

// Get single appointment
router.get('/:id', appointmentController.getAppointment);

// Create appointment (only doctors and patients can create)
router.post(
  '/',
  checkRole(['doctor', 'patient']),
  validateAppointment,
  appointmentController.createAppointment
);

// Update appointment (only doctors and patients can update)
router.put(
  '/:id',
  checkRole(['doctor', 'patient']),
  validateAppointment,
  appointmentController.updateAppointment
);

// Delete appointment (only doctors and patients can delete)
router.delete(
  '/:id',
  checkRole(['doctor', 'patient']),
  appointmentController.deleteAppointment
);

export const appointmentRoutes = router; 