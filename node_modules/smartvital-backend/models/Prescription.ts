import mongoose, { Schema, Document } from 'mongoose';

export interface IPrescription extends Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  medication: mongoose.Types.ObjectId;
  datePrescribed: Date;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  refills: number;
  status: string;
  pharmacy: {
    name: string;
    address: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PrescriptionSchema: Schema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  medication: { type: Schema.Types.ObjectId, ref: 'Medication', required: true },
  datePrescribed: { type: Date, required: true, default: Date.now },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  duration: { type: String, required: true },
  instructions: { type: String, required: true },
  refills: { type: Number, required: true, default: 0 },
  status: { 
    type: String, 
    required: true,
    enum: ['Active', 'Completed', 'Cancelled', 'Expired']
  },
  pharmacy: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true }
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
PrescriptionSchema.index({ patient: 1, datePrescribed: -1 });
PrescriptionSchema.index({ doctor: 1, datePrescribed: -1 });
PrescriptionSchema.index({ status: 1 });
PrescriptionSchema.index({ medication: 1 });

// Add method to check if prescription is expired
PrescriptionSchema.methods.isExpired = function() {
  const durationInDays = parseInt(this.duration);
  const expiryDate = new Date(this.datePrescribed);
  expiryDate.setDate(expiryDate.getDate() + durationInDays);
  return new Date() > expiryDate;
};

// Add method to check if prescription can be refilled
PrescriptionSchema.methods.canBeRefilled = function() {
  return this.refills > 0 && this.status === 'Active';
};

// Add method to get remaining refills
PrescriptionSchema.virtual('remainingRefills').get(function() {
  return this.refills;
});

// Add pre-save middleware to validate prescription
PrescriptionSchema.pre('save', async function(next) {
  if (this.isModified('status') && this.status === 'Expired') {
    if (!this.isExpired()) {
      throw new Error('Cannot mark prescription as expired before its duration');
    }
  }
  next();
});

// Add method to get prescription history
PrescriptionSchema.statics.getPrescriptionHistory = async function(patientId: string) {
  return this.find({ patient: patientId })
    .sort({ datePrescribed: -1 })
    .populate('medication')
    .populate('doctor');
};

export const Prescription = mongoose.model<IPrescription>('Prescription', PrescriptionSchema); 