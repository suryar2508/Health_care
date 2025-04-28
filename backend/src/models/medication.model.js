const mongoose = require('mongoose');

const adherenceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  taken: {
    type: Boolean,
    required: true
  },
  notes: {
    type: String,
    trim: true
  }
}, { timestamps: true });

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
    required: true,
    trim: true
  },
  frequency: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'discontinued'],
    default: 'active'
  },
  prescribedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  adherence: [adherenceSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculating adherence rate
medicationSchema.virtual('adherenceRate').get(function() {
  if (this.adherence.length === 0) return 0;
  const takenDoses = this.adherence.filter(a => a.taken).length;
  return (takenDoses / this.adherence.length) * 100;
});

// Index for efficient queries
medicationSchema.index({ patient: 1, status: 1 });
medicationSchema.index({ startDate: -1 });

const Medication = mongoose.model('Medication', medicationSchema);

module.exports = Medication; 