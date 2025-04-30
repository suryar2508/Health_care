import express from 'express';
import { Patient } from '../models/Patient';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get all patients
router.get('/', auth, async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients' });
  }
});

// Get patient by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient' });
  }
});

// Create new patient
router.post('/', auth, async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ message: 'Error creating patient' });
  }
});

// Update patient
router.put('/:id', auth, async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(400).json({ message: 'Error updating patient' });
  }
});

// Delete patient
router.delete('/:id', auth, async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting patient' });
  }
});

// Get patient's medical history
router.get('/:id/medical-history', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('medicalHistory');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient.medicalHistory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medical history' });
  }
});

// Get patient's appointments
router.get('/:id/appointments', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('appointments');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient.appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// Get patient's prescriptions
router.get('/:id/prescriptions', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('prescriptions');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient.prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescriptions' });
  }
});

export default router; 