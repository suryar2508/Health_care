import express from 'express';
import {
  getDoctorAppointments,
  getPatientAppointments,
  createAppointment,
  updateAppointmentStatus,
  getDoctorStats,
} from '../controllers/appointmentController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Doctor routes
router.get('/doctor', authenticate, getDoctorAppointments);
router.get('/doctor/stats', authenticate, getDoctorStats);
router.patch('/:id/status', authenticate, updateAppointmentStatus);

// Patient routes
router.get('/patient', authenticate, getPatientAppointments);
router.post('/', authenticate, createAppointment);

export default router; 