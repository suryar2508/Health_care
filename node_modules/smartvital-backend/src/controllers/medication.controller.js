const medicationService = require('../services/medication.service');
const { validationResult } = require('express-validator');

// Get all medications
exports.getAllMedications = async (req, res) => {
  try {
    const filters = {
      patient: req.query.patient,
      status: req.query.status,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };

    const medications = await medicationService.getAllMedications(filters);
    res.json(medications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single medication
exports.getMedication = async (req, res) => {
  try {
    const medication = await medicationService.getMedicationById(req.params.id);
    res.json(medication);
  } catch (error) {
    if (error.message === 'Medication not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// Create a new medication
exports.createMedication = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const medication = await medicationService.createMedication(req.body, req.user.id);
    res.status(201).json(medication);
  } catch (error) {
    if (error.message.includes('Patient not found') || error.message.includes('Unauthorized prescriber')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// Update a medication
exports.updateMedication = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const medication = await medicationService.updateMedication(req.params.id, req.body);
    res.json(medication);
  } catch (error) {
    if (error.message === 'Medication not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// Delete a medication
exports.deleteMedication = async (req, res) => {
  try {
    const result = await medicationService.deleteMedication(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.message === 'Medication not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// Get medications for a specific patient
exports.getPatientMedications = async (req, res) => {
  try {
    const medications = await medicationService.getPatientMedications(req.params.patientId);
    res.json(medications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Record medication adherence
exports.recordAdherence = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const medication = await medicationService.recordAdherence(req.params.id, req.body);
    res.json(medication);
  } catch (error) {
    if (error.message === 'Medication not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// Get adherence report for a medication
exports.getAdherenceReport = async (req, res) => {
  try {
    const report = await medicationService.generateAdherenceReport(req.params.id);
    res.json(report);
  } catch (error) {
    if (error.message === 'Medication not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}; 