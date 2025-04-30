export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  age?: number;
  gender: string;
  bloodGroup: string;
  phoneNumber: string;
  address: string;
  condition: string;
  lastVisit: string;
  medicalHistory?: MedicalHistoryItem[];
  notes?: string;
  appointments?: Appointment[];
  healthMetrics?: HealthMetric[];
}

export interface MedicalHistoryItem {
  condition: string;
  date: string;
  notes: string;
}

export interface HealthMetric {
  date: string;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number;
  bloodOxygen: number;
  temperature: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  type: 'checkup' | 'consultation' | 'follow-up' | 'emergency' | 'procedure';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  duration: string;
  reminderEnabled?: boolean;
  videoConsultation?: boolean;
  feedback?: any;
  createdAt?: string;
  updatedAt?: string;
  patient?: {
    name: string;
    email: string;
    phone: string;
  };
  doctor?: {
    name: string;
    specialization: string;
  };
} 