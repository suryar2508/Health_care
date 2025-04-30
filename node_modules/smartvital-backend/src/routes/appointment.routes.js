const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const appointmentController = require('../controllers/appointment.controller');
const auth = require('../middleware/auth');

// Validation middleware
const validateAppointment = [
  body('patient').isMongoId().withMessage('Valid patient ID is required'),
  body('doctor').isMongoId().withMessage('Valid doctor ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format (HH:MM) is required'),
  body('duration').isInt({ min: 15, max: 60 }).withMessage('Duration must be between 15 and 60 minutes'),
  body('type').isIn(['Check-up', 'Follow-up', 'Consultation', 'Emergency', 'Procedure']).withMessage('Valid appointment type is required'),
  body('status').optional().isIn(['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No-show']).withMessage('Valid status is required'),
  body('notes').optional().isString()
];

// Routes
router.get('/', auth, appointmentController.getAllAppointments);
router.get('/:id', auth, appointmentController.getAppointment);
router.post('/', [auth, validateAppointment], appointmentController.createAppointment);
router.put('/:id', [auth, validateAppointment], appointmentController.updateAppointment);
router.delete('/:id', auth, appointmentController.deleteAppointment);

// Doctor and patient specific routes
router.get('/doctor/:doctorId/:startDate?/:endDate?', auth, appointmentController.getDoctorSchedule);
router.get('/patient/:patientId', auth, appointmentController.getPatientAppointments);

module.exports = router; 