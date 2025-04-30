const mongoose = require('mongoose');

const vitalSignsSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  bloodPressure: {
    systolic: Number,
    diastolic: Number
  },
  heartRate: Number,
  temperature: Number,
  weight: Number
}, {
  timestamps: true
});

module.exports = mongoose.model('VitalSigns', vitalSignsSchema); 