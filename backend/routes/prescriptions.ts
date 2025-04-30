import express from 'express';
import { Prescription } from '../models/Prescription';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get all prescriptions (admin only)
router.get('/', auth(['admin']), async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('patient')
      .populate('doctor')
      .populate('medication');
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescriptions' });
  }
});

// Get patient's prescriptions
router.get('/patient/:patientId', auth(['admin', 'doctor', 'patient']), async (req, res) => {
  try {
    const prescriptions = await Prescription.getPrescriptionHistory(req.params.patientId);
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient prescriptions' });
  }
});

// Get doctor's prescriptions
router.get('/doctor/:doctorId', auth(['admin', 'doctor']), async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctor: req.params.doctorId })
      .populate('patient')
      .populate('medication');
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor prescriptions' });
  }
});

// Create new prescription
router.post('/', auth(['admin', 'doctor']), async (req, res) => {
  try {
    const prescription = new Prescription(req.body);
    await prescription.save();
    res.status(201).json(prescription);
  } catch (error) {
    res.status(400).json({ message: 'Error creating prescription' });
  }
});

// Update prescription
router.put('/:id', auth(['admin', 'doctor']), async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.json(prescription);
  } catch (error) {
    res.status(400).json({ message: 'Error updating prescription' });
  }
});

// Delete prescription
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting prescription' });
  }
});

// Refill prescription
router.post('/:id/refill', auth(['admin', 'doctor', 'patient']), async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    if (!prescription.canBeRefilled()) {
      return res.status(400).json({ message: 'Prescription cannot be refilled' });
    }
    prescription.refills -= 1;
    await prescription.save();
    res.json(prescription);
  } catch (error) {
    res.status(400).json({ message: 'Error refilling prescription' });
  }
});

export default router; 