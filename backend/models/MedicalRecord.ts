import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicalRecord extends Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  date: Date;
  visitType: 'regular' | 'follow-up' | 'emergency' | 'consultation';
  chiefComplaint: string;
  vitalSigns: {
    bloodPressure: {
      systolic: number;
      diastolic: number;
    };
    heartRate: number;
    temperature: number;
    respiratoryRate: number;
    oxygenSaturation: number;
    weight: number;
    height: number;
    bmi: number;
  };
  diagnosis: string;
  treatment: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    sideEffects: string[];
  }>;
  labResults: Array<{
    testName: string;
    result: string;
    unit: string;
    referenceRange: string;
    date: Date;
  }>;
  notes: string;
  followUpDate?: Date;
  attachments: Array<{
    name: string;
    url: string;
    type: string;
    uploadDate: Date;
  }>;
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const medicalRecordSchema = new Schema<IMedicalRecord>(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    visitType: {
      type: String,
      enum: ['regular', 'follow-up', 'emergency', 'consultation'],
      required: true,
    },
    chiefComplaint: {
      type: String,
      required: true,
    },
    vitalSigns: {
      bloodPressure: {
        systolic: {
          type: Number,
          required: true,
          min: 60,
          max: 250,
        },
        diastolic: {
          type: Number,
          required: true,
          min: 40,
          max: 150,
        },
      },
      heartRate: {
        type: Number,
        required: true,
        min: 40,
        max: 200,
      },
      temperature: {
        type: Number,
        required: true,
        min: 35,
        max: 42,
      },
      respiratoryRate: {
        type: Number,
        required: true,
        min: 8,
        max: 40,
      },
      oxygenSaturation: {
        type: Number,
        required: true,
        min: 70,
        max: 100,
      },
      weight: {
        type: Number,
        required: true,
        min: 0,
      },
      height: {
        type: Number,
        required: true,
        min: 0,
      },
      bmi: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    diagnosis: {
      type: String,
      required: true,
    },
    treatment: {
      type: String,
      required: true,
    },
    medications: [{
      name: {
        type: String,
        required: true,
      },
      dosage: {
        type: String,
        required: true,
      },
      frequency: {
        type: String,
        required: true,
      },
      duration: {
        type: String,
        required: true,
      },
      instructions: {
        type: String,
        required: true,
      },
      sideEffects: [{
        type: String,
      }],
    }],
    labResults: [{
      testName: {
        type: String,
        required: true,
      },
      result: {
        type: String,
        required: true,
      },
      unit: {
        type: String,
        required: true,
      },
      referenceRange: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        required: true,
        default: Date.now,
      },
    }],
    notes: {
      type: String,
      required: true,
    },
    followUpDate: {
      type: Date,
    },
    attachments: [{
      name: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      uploadDate: {
        type: Date,
        default: Date.now,
      },
    }],
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
medicalRecordSchema.index({ patient: 1, date: -1 });
medicalRecordSchema.index({ doctor: 1, date: -1 });
medicalRecordSchema.index({ status: 1 });
medicalRecordSchema.index({ visitType: 1 });
medicalRecordSchema.index({ 'labResults.testName': 1 });
medicalRecordSchema.index({ 'medications.name': 1 });

// Calculate BMI before saving
medicalRecordSchema.pre('save', function(next) {
  if (this.isModified('vitalSigns.height') || this.isModified('vitalSigns.weight')) {
    const heightInMeters = this.vitalSigns.height / 100;
    this.vitalSigns.bmi = this.vitalSigns.weight / (heightInMeters * heightInMeters);
  }
  next();
});

// Static method to get patient's medical history
medicalRecordSchema.statics.getPatientHistory = async function(patientId: mongoose.Types.ObjectId) {
  return this.find({ patient: patientId })
    .sort({ date: -1 })
    .populate('doctor', 'name email')
    .exec();
};

// Static method to get doctor's records
medicalRecordSchema.statics.getDoctorRecords = async function(doctorId: mongoose.Types.ObjectId) {
  return this.find({ doctor: doctorId })
    .sort({ date: -1 })
    .populate('patient', 'name email')
    .exec();
};

// Static method to get records needing follow-up
medicalRecordSchema.statics.getFollowUpRecords = async function() {
  return this.find({
    followUpDate: { $lte: new Date() },
    status: 'active'
  })
  .populate('patient', 'name email')
  .populate('doctor', 'name email')
  .exec();
};

// Static method to get records by date range
medicalRecordSchema.statics.getRecordsByDateRange = async function(
  startDate: Date,
  endDate: Date,
  patientId?: mongoose.Types.ObjectId
) {
  const query: any = {
    date: { $gte: startDate, $lte: endDate }
  };
  if (patientId) {
    query.patient = patientId;
  }
  return this.find(query)
    .sort({ date: -1 })
    .populate('patient', 'name email')
    .populate('doctor', 'name email')
    .exec();
};

// Static method to get records by diagnosis
medicalRecordSchema.statics.getRecordsByDiagnosis = async function(diagnosis: string) {
  return this.find({
    diagnosis: { $regex: diagnosis, $options: 'i' }
  })
  .populate('patient', 'name email')
  .populate('doctor', 'name email')
  .exec();
};

// Static method to get records by medication
medicalRecordSchema.statics.getRecordsByMedication = async function(medicationName: string) {
  return this.find({
    'medications.name': { $regex: medicationName, $options: 'i' }
  })
  .populate('patient', 'name email')
  .populate('doctor', 'name email')
  .exec();
};

// Static method to get records by lab test
medicalRecordSchema.statics.getRecordsByLabTest = async function(testName: string) {
  return this.find({
    'labResults.testName': { $regex: testName, $options: 'i' }
  })
  .populate('patient', 'name email')
  .populate('doctor', 'name email')
  .exec();
};

// Static method to get patient's vital signs history
medicalRecordSchema.statics.getPatientVitalSignsHistory = async function(patientId: mongoose.Types.ObjectId) {
  return this.find({ patient: patientId })
    .select('date vitalSigns')
    .sort({ date: -1 })
    .exec();
};

// Static method to get patient's medication history
medicalRecordSchema.statics.getPatientMedicationHistory = async function(patientId: mongoose.Types.ObjectId) {
  return this.find({ patient: patientId })
    .select('date medications')
    .sort({ date: -1 })
    .exec();
};

// Static method to get patient's lab results history
medicalRecordSchema.statics.getPatientLabResultsHistory = async function(patientId: mongoose.Types.ObjectId) {
  return this.find({ patient: patientId })
    .select('date labResults')
    .sort({ date: -1 })
    .exec();
};

const MedicalRecord = mongoose.model<IMedicalRecord>('MedicalRecord', medicalRecordSchema);

export default MedicalRecord; 