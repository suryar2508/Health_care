const express = require('express');
const router = express.Router();
const VitalSigns = require('../models/vitalSigns.model');
const auth = require('../middleware/auth');

// Get all vital signs for a patient
router.get('/', auth, async (req, res) => {
  try {
    const vitalSigns = await VitalSigns.find({ patientId: req.user.id })
      .sort({ date: -1 })
      .limit(30); // Get last 30 readings

    // Format data for frontend
    const formattedData = {
      bloodPressure: vitalSigns
        .filter(vs => vs.bloodPressure)
        .map(vs => ({
          date: vs.date.toISOString().split('T')[0],
          systolic: vs.bloodPressure.systolic,
          diastolic: vs.bloodPressure.diastolic
        })),
      heartRate: vitalSigns
        .filter(vs => vs.heartRate)
        .map(vs => ({
          date: vs.date.toISOString().split('T')[0],
          rate: vs.heartRate
        })),
      temperature: vitalSigns
        .filter(vs => vs.temperature)
        .map(vs => ({
          date: vs.date.toISOString().split('T')[0],
          temp: vs.temperature
        })),
      weight: vitalSigns
        .filter(vs => vs.weight)
        .map(vs => ({
          date: vs.date.toISOString().split('T')[0],
          weight: vs.weight
        }))
    };

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching vital signs:', error);
    res.status(500).json({ message: 'Error fetching vital signs' });
  }
});

// Add new vital signs
router.post('/', auth, async (req, res) => {
  try {
    const { systolic, diastolic, heartRate, temperature, weight } = req.body;
    
    const newVitalSigns = new VitalSigns({
      patientId: req.user.id,
      bloodPressure: systolic && diastolic ? { systolic, diastolic } : undefined,
      heartRate,
      temperature,
      weight
    });

    await newVitalSigns.save();
    res.status(201).json({ message: 'Vital signs added successfully' });
  } catch (error) {
    console.error('Error adding vital signs:', error);
    res.status(500).json({ message: 'Error adding vital signs' });
  }
});

module.exports = router; 