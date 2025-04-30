const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  bloodGroup: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    required: true
  },
  lastVisit: {
    type: Date,
    default: Date.now
  },
  medicalHistory: {
    type: String
  },
  notes: {
    type: String
  },
  healthMetrics: [{
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    },
    heartRate: Number,
    bloodOxygen: Number,
    temperature: Number,
    timestamp: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema); 