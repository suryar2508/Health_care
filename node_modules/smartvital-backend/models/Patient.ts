import mongoose, { Schema, Document } from 'mongoose';

export interface IPatient extends Document {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  medicalHistory: {
    allergies: string[];
    chronicConditions: string[];
    bloodType: string;
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
  appointments: mongoose.Types.ObjectId[];
  prescriptions: mongoose.Types.ObjectId[];
  medicalRecords: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  medicalHistory: {
    allergies: [{ type: String }],
    chronicConditions: [{ type: String }],
    bloodType: { type: String, required: true },
    emergencyContact: {
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      phone: { type: String, required: true }
    }
  },
  insurance: {
    provider: { type: String, required: true },
    policyNumber: { type: String, required: true },
    groupNumber: { type: String, required: true }
  },
  appointments: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }],
  prescriptions: [{ type: Schema.Types.ObjectId, ref: 'Prescription' }],
  medicalRecords: [{ type: Schema.Types.ObjectId, ref: 'MedicalRecord' }]
}, {
  timestamps: true
});

// Add indexes for better query performance
PatientSchema.index({ email: 1 });
PatientSchema.index({ 'insurance.policyNumber': 1 });
PatientSchema.index({ lastName: 1, firstName: 1 });

// Add virtual for full name
PatientSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Add method to get age
PatientSchema.methods.getAge = function() {
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Add method to check if patient has active prescriptions
PatientSchema.methods.hasActivePrescriptions = async function() {
  const activePrescriptions = await mongoose.model('Prescription').find({
    patient: this._id,
    status: 'Active'
  });
  return activePrescriptions.length > 0;
};

export const Patient = mongoose.model<IPatient>('Patient', PatientSchema); 