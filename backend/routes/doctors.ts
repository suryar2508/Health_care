import express from 'express';
import { Doctor } from '../models/Doctor';
import { auth, checkRole } from '../middleware/auth';

const router = express.Router();

// Get all doctors
router.get('/', auth, async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});

// Get doctor by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor' });
  }
});

// Create new doctor (admin only)
router.post('/', auth, checkRole(['admin']), async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json(doctor);
  } catch (error) {
    res.status(400).json({ message: 'Error creating doctor' });
  }
});

// Update doctor
router.put('/:id', auth, checkRole(['admin', 'doctor']), async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(400).json({ message: 'Error updating doctor' });
  }
});

// Delete doctor (admin only)
router.delete('/:id', auth, checkRole(['admin']), async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting doctor' });
  }
});

// Get doctor's schedule
router.get('/:id/schedule', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor.availability);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schedule' });
  }
});

// Update doctor's schedule
router.put('/:id/schedule', auth, checkRole(['admin', 'doctor']), async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { availability: req.body },
      { new: true }
    );
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor.availability);
  } catch (error) {
    res.status(400).json({ message: 'Error updating schedule' });
  }
});

// Get doctor's upcoming appointments
router.get('/:id/appointments', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    const appointments = await doctor.getUpcomingAppointments();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// Get doctor's patient list
router.get('/:id/patients', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    const patients = await doctor.getPatientList();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients' });
  }
});

export default router; 