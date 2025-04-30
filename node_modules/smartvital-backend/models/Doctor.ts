import mongoose, { Schema, Document } from 'mongoose';

export interface IDoctor extends Document {
  firstName: string;
  lastName: string;
  specialty: string;
  email: string;
  phone: string;
  licenseNumber: string;
  education: {
    medicalSchool: string;
    graduationYear: number;
    residency: string;
    fellowship: string;
  };
  availability: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
  };
  languages: string[];
  department: string;
  appointments: mongoose.Types.ObjectId[];
  patients: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  specialty: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  education: {
    medicalSchool: { type: String, required: true },
    graduationYear: { type: Number, required: true },
    residency: { type: String, required: true },
    fellowship: { type: String, required: true }
  },
  availability: {
    monday: [{ type: String }],
    tuesday: [{ type: String }],
    wednesday: [{ type: String }],
    thursday: [{ type: String }],
    friday: [{ type: String }]
  },
  languages: [{ type: String }],
  department: { type: String, required: true },
  appointments: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }],
  patients: [{ type: Schema.Types.ObjectId, ref: 'Patient' }]
}, {
  timestamps: true
});

// Add indexes for better query performance
DoctorSchema.index({ email: 1 });
DoctorSchema.index({ licenseNumber: 1 });
DoctorSchema.index({ specialty: 1 });
DoctorSchema.index({ department: 1 });

// Add virtual for full name
DoctorSchema.virtual('fullName').get(function() {
  return `Dr. ${this.firstName} ${this.lastName}`;
});

// Add method to check availability for a specific date and time
DoctorSchema.methods.isAvailable = function(date: Date, time: string) {
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'lowercase' });
  const availableSlots = this.availability[dayOfWeek as keyof typeof this.availability];
  
  if (!availableSlots || availableSlots.length === 0) {
    return false;
  }

  // Check if the requested time falls within any available slot
  return availableSlots.some(slot => {
    const [start, end] = slot.split('-');
    return time >= start && time <= end;
  });
};

// Add method to get upcoming appointments
DoctorSchema.methods.getUpcomingAppointments = async function() {
  const today = new Date();
  return mongoose.model('Appointment').find({
    doctor: this._id,
    date: { $gte: today },
    status: 'Scheduled'
  }).sort({ date: 1, time: 1 });
};

// Add method to get patient list
DoctorSchema.methods.getPatientList = async function() {
  return mongoose.model('Patient').find({
    _id: { $in: this.patients }
  });
};

export const Doctor = mongoose.model<IDoctor>('Doctor', DoctorSchema); 