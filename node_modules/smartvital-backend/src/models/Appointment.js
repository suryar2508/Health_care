const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 30, // in minutes
    enum: [15, 30, 45, 60]
  },
  type: {
    type: String,
    required: true,
    enum: ['Check-up', 'Follow-up', 'Consultation', 'Emergency', 'Procedure']
  },
  status: {
    type: String,
    required: true,
    enum: ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No-show'],
    default: 'Scheduled'
  },
  notes: {
    type: String
  },
  reminderSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient querying
appointmentSchema.index({ patient: 1, date: 1 });
appointmentSchema.index({ doctor: 1, date: 1 });
appointmentSchema.index({ status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema); 