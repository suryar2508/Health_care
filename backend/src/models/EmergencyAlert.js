const mongoose = require('mongoose');

const emergencyAlertSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Critical', 'High', 'Medium', 'Low']
  },
  source: {
    type: String,
    required: true,
    enum: ['Health Metrics', 'Manual', 'Device', 'Caregiver']
  },
  description: {
    type: String,
    required: true
  },
  metrics: {
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    },
    heartRate: Number,
    bloodOxygen: Number,
    temperature: Number
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    address: String
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Acknowledged', 'Resolved', 'False Alarm'],
    default: 'Active'
  },
  acknowledgedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: {
    type: Date
  },
  actions: [{
    takenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    action: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  notifications: [{
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    readAt: Date,
    method: {
      type: String,
      enum: ['Email', 'SMS', 'Push', 'In-app']
    }
  }]
}, {
  timestamps: true
});

// Index for efficient querying
emergencyAlertSchema.index({ patient: 1, status: 1 });
emergencyAlertSchema.index({ type: 1, status: 1 });
emergencyAlertSchema.index({ createdAt: -1 });

// Geospatial index for location-based queries
emergencyAlertSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('EmergencyAlert', emergencyAlertSchema); 