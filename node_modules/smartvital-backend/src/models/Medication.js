const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    required: true,
    enum: ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'As needed']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  prescribedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pharmacy: {
    name: String,
    phone: String,
    address: String
  },
  instructions: {
    type: String
  },
  sideEffects: [{
    type: String
  }],
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Completed', 'Discontinued'],
    default: 'Active'
  },
  reminders: {
    enabled: {
      type: Boolean,
      default: true
    },
    times: [{
      type: String // Format: "HH:MM"
    }]
  },
  adherence: [{
    date: {
      type: Date,
      default: Date.now
    },
    taken: {
      type: Boolean,
      default: false
    },
    notes: String
  }]
}, {
  timestamps: true
});

// Index for efficient querying
medicationSchema.index({ patient: 1, status: 1 });
medicationSchema.index({ patient: 1, name: 1 });

module.exports = mongoose.model('Medication', medicationSchema); 