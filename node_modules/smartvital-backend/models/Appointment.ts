import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  duration: number;
  type: string;
  status: string;
  reason: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema: Schema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  duration: { type: Number, required: true, default: 30 }, // Duration in minutes
  type: { 
    type: String, 
    required: true,
    enum: ['New Patient', 'Follow-up', 'Consultation', 'Emergency']
  },
  status: { 
    type: String, 
    required: true,
    enum: ['Scheduled', 'Completed', 'Cancelled', 'No-show']
  },
  reason: { type: String, required: true },
  notes: { type: String }
}, {
  timestamps: true
});

// Add indexes for better query performance
AppointmentSchema.index({ patient: 1, date: 1 });
AppointmentSchema.index({ doctor: 1, date: 1 });
AppointmentSchema.index({ status: 1 });
AppointmentSchema.index({ type: 1 });

// Add method to check if appointment time conflicts with existing appointments
AppointmentSchema.methods.hasTimeConflict = async function() {
  const startTime = new Date(`${this.date.toISOString().split('T')[0]}T${this.time}`);
  const endTime = new Date(startTime.getTime() + this.duration * 60000);

  const conflictingAppointments = await mongoose.model('Appointment').find({
    _id: { $ne: this._id },
    doctor: this.doctor,
    date: this.date,
    $or: [
      {
        $and: [
          { time: { $lte: this.time } },
          { 
            $expr: { 
              $gte: [
                { $add: [{ $toDate: { $concat: [{ $toString: '$date' }, 'T', '$time'] } }, { $multiply: ['$duration', 60000] }] },
                startTime
              ]
            }
          }
        ]
      },
      {
        $and: [
          { time: { $gte: this.time } },
          { 
            $expr: { 
              $lte: [
                { $toDate: { $concat: [{ $toString: '$date' }, 'T', '$time'] } },
                endTime
              ]
            }
          }
        ]
      }
    ]
  });

  return conflictingAppointments.length > 0;
};

// Add method to check if appointment is in the past
AppointmentSchema.methods.isPast = function() {
  const appointmentDateTime = new Date(`${this.date.toISOString().split('T')[0]}T${this.time}`);
  return appointmentDateTime < new Date();
};

// Add method to get appointment duration in hours and minutes
AppointmentSchema.virtual('durationFormatted').get(function() {
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  return `${hours}h ${minutes}m`;
});

// Add pre-save middleware to validate appointment
AppointmentSchema.pre('save', async function(next) {
  if (this.isModified('date') || this.isModified('time') || this.isModified('doctor')) {
    const hasConflict = await this.hasTimeConflict();
    if (hasConflict) {
      throw new Error('Appointment time conflicts with existing appointments');
    }
  }
  next();
});

export const Appointment = mongoose.model<IAppointment>('Appointment', AppointmentSchema); 