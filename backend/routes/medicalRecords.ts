import express from 'express';
import { MedicalRecord } from '../models/MedicalRecord';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get all medical records (admin only)
router.get('/', auth(['admin']), async (req, res) => {
  try {
    const records = await MedicalRecord.find()
      .populate('patient')
      .populate('doctor')
      .populate('medications.medication');
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medical records' });
  }
});

// Get patient's medical history
router.get('/patient/:patientId', auth(['admin', 'doctor', 'patient']), async (req, res) => {
  try {
    const records = await MedicalRecord.getPatientHistory(req.params.patientId);
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient medical history' });
  }
});

// Get doctor's patient records
router.get('/doctor/:doctorId', auth(['admin', 'doctor']), async (req, res) => {
  try {
    const records = await MedicalRecord.getDoctorRecords(req.params.doctorId);
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor records' });
  }
});

// Create new medical record
router.post('/', auth(['admin', 'doctor']), async (req, res) => {
  try {
    const record = new MedicalRecord(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: 'Error creating medical record' });
  }
});

// Update medical record
router.put('/:id', auth(['admin', 'doctor']), async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(400).json({ message: 'Error updating medical record' });
  }
});

// Delete medical record
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    res.json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting medical record' });
  }
});

// Get records needing follow-up
router.get('/follow-up', auth(['admin', 'doctor']), async (req, res) => {
  try {
    const records = await MedicalRecord.find({
      followUpDate: { $lte: new Date() }
    })
    .populate('patient')
    .populate('doctor');
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching follow-up records' });
  }
});

// Add attachment to medical record
router.post('/:id/attachments', auth(['admin', 'doctor']), async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    record.attachments.push(req.body);
    await record.save();
    res.json(record);
  } catch (error) {
    res.status(400).json({ message: 'Error adding attachment' });
  }
});

export default router; 